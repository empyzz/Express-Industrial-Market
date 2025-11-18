import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../lib/prisma";


export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);

    req.flash("error_msg", errorMessages + JSON.stringify(req.body));
    req.flash("formData", JSON.stringify(req.body));

    res.redirect("/auth/register");
    return;
  }

  next();
};


export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ min: 3 })
    .withMessage("Nome deve ter no mínimo 3 caracteres"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email é obrigatório")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Senha é obrigatória")
    .isLength({ min: 6 })
    .withMessage("Senha deve ter no mínimo 6 caracteres"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirmação de senha é obrigatória")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("As senhas não coincidem");
      }
      return true;
    }),

  body("userType")
    .notEmpty()
    .withMessage("Tipo de usuário é obrigatório")
    .isIn(["BUYER", "SUPPLIER"])
    .withMessage("Tipo de usuário inválido"),

  body("terms")
    .notEmpty()
    .withMessage("Você deve aceitar os termos de uso")
    .isIn(["on", "true", "1"])
    .withMessage("Você deve aceitar os termos de uso"),

  handleValidationErrors,
];


export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email é obrigatório")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Senha é obrigatória"),

  handleValidationErrors,
];


// Verificar se usuário está autenticado
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.user) {
    return next();
  }

  req.flash("error_msg", "Por favor, faça login para acessar esta página.");
  res.redirect("/auth/login");
};


export const isGuest = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.user) {
    const redirectPath = req.session.user.userType === "SUPPLIER" ? "/supplier/dashboard" : "/buyer/dashboard";
    return res.redirect(redirectPath);
  }
  next();
};


// Verificar se é comprador
export const isBuyer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.user.id) {
    req.flash("error_msg", "Por favor, faça login para acessar esta página");
    return res.redirect("/auth/login");
  }

  if (req.session.user.userType !== "BUYER") {
    req.flash("error_msg", "Acesso negado. Esta área é exclusiva para compradores");
    return res.redirect("/");
  }

  next();
};

// Verificar se é fornecedor
export const isSupplier = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.user.id) {
    req.flash("error_msg", "Por favor, faça login para acessar esta página");
    return res.redirect("/auth/login");
  }

  if (req.session.user.userType !== "SUPPLIER") {
    req.flash("error_msg", "Acesso negado. Esta área é exclusiva para fornecedores");
    return res.redirect("/");
  }

  next();
};

// Carregar dados do usuário logado
export const loadUser = async (req: Request, res: Response, next: NextFunction) => {
  res.locals.user = null;

    if (req.path.startsWith('/css') || req.path.startsWith('/js') || req.path.includes('favicon.ico')) {
    return next(); // Pula todo o middleware para arquivos estáticos | evitar double request
  }
  if (!req.session || !req.session.user ) {
    console.log("No session or no user");
    return next();
  };
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        lastLogin: true,
        company: {
          select: {
            id: true,
            razaoSocial: true,
          },
        },

        },
      })

    if (!user) {
      console.log("User got destroyed")
      req.session.destroy(() => {});
      return next();
    }

    // Atualizar último login se necessário
    if (!user.lastLogin || Date.now() - user.lastLogin.getTime() > 3600000) {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    }

    if (user){
      console.log("user exist", user.name)
      res.locals.user = user;
      res.locals.unreadNotifications = 0;
    }

  } catch (error) {
    console.error("Erro ao carregar usuário no middleware:", error);
  }

  next();
};

// Verificar se usuário possui empresa cadastrada
export const hasCompany = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.user.id) {
    req.flash("error_msg", "Por favor, faça login para acessar esta página");
    return res.redirect("/auth/login");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        company: {
          select: {
            id: true,
            razaoSocial: true,
          },
        },
      },
    });
    if (!user?.company) {
      req.flash("error_msg", "Por favor, complete o cadastro da sua empresa primeiro");
      return res.redirect("/auth/complete-profile");
    }

    req.session.user = user.company.id;
    next();
  } catch (error) {
    console.error("Erro ao verificar empresa:", error);
    req.flash("error_msg", "Erro ao verificar dados da empresa");
    res.redirect("/");
  }
};


// verificar autenticação, carregar usuário e conta ativa
export const ensureAuthenticated = [isAuthenticated, loadUser];

// Rate limiting simples
export const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.session?.user.id || req.ip;
    const now = Date.now();

    if (!requests.has(identifier)) requests.set(identifier, []);
    const userRequests = requests.get(identifier) || [];
    const recentRequests = userRequests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      req.flash("error_msg", "Muitas requisições. Por favor, aguarde alguns minutos");
      return res.status(429).redirect("back");
    }

    recentRequests.push(now);
    requests.set(identifier, recentRequests);

    // Limpar entradas antigas a cada 1000 usuários
    if (requests.size > 1000) requests.clear();

    next();
  };
};

export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const sanitize = (obj: any): void => {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key]
          .replace(
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            ""
          )
          .replace(
            /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
            ""
          )
          .trim();
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);

  next();
};
