import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";


declare global {
  namespace Express {
    interface Request {
      flash(type: string, message: string | string[]): void;
    }
  }
}

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);

    req.flash("error_msg", errorMessages);
    req.flash("formData", JSON.stringify(req.body));

    res.redirect("back");
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
    .isIn(["buyer", "supplier"])
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
