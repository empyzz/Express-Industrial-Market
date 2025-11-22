import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { randomBytes } from 'crypto';
import mailer from '../config/mailer';

// Login controller

export const GetLogin = (req: Request, res: Response) => {
  res.render("auth/login", { title: "Login" });
};

export const PostLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('error_msg', 'Insira seu Email e Senha');
      res.render("auth/login", { 
        title: "Login"
      });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      req.flash('error_msg', "Usuario incorreto",);
      res.render("auth/login", {
        title:"Login"
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      req.flash('error_msg', "Senha incorreta");
      res.render("auth/login", {
        error: "Invalid password",
        title:"Login"
      });
      return;
    }

    // 3. Save session
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType
    };

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect('/');
      }
      return res.redirect('/');
    });

  } catch (err) {
    console.error(err);
    res.render("auth/login", {
      error: "Something went wrong!",
      title:"Login"
    });
  }
};


// Register controller
export const getRegister = (req: Request, res: Response) => {
  res.render("auth/register", { title: "Register" });
};


export const PostRegister = async (req: Request, res: Response) => {
  console.log("POST BODY:", req.body);
  try {
    const { name, email, password, userType, phone } = req.body;  

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.render("auth/register", {
        title: "Register",
        error: "Email already registered",
      });
      return;
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        phone,
        userType,
        lastLogin: new Date(),
        isActive: true,
      },
    });

    // Auto-login
    req.session.user = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      userType: newUser.userType
    };

    res.redirect("/");
  } catch (err) {
    console.error(err, req.body);
    res.render("auth/register", {
      title: "Register",
      error: "Error creating your account",
    });
  }
};


export const GetLogout = (req: Request, res: Response) => {
  // Destrói a sessão
  req.session.destroy((err) => {
    if (err) {
      console.error("Erro ao destruir a sessão:", err);
      return (console.log(err)); 
    }
    res.redirect("/auth/login");
  });
};


export const getCompleteProfile = (req: Request, res: Response) => {
    const error_msg = req.flash('error_msg');
    res.render('auth/complete-profile', { 
        title: 'Complete seu Cadastro',
        error_msg 
    });
};


export const postCompleteProfile = async (req: Request, res: Response) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Sessão expirada. Por favor, faça login novamente.');
        return res.redirect('/auth/login');
    }

    const {
        razaoSocial,
        nomeFantasia,
        cnpj,
        inscricaoEstadual,
        phone,
        email,
        cep,
        street,
        number,
        complement,
        neighborhood,
        city,
        state
    } = req.body;

    const userId = req.session.user.id;

    try {

        const existingCompany = await prisma.company.findUnique({
            where: { cnpj: cnpj.replace(/\D/g, '') }
        });

        if (existingCompany) {
            req.flash('error_msg', 'Este CNPJ já está cadastrado na plataforma.');
            return res.redirect('/auth/complete-profile');
        }

        await prisma.company.create({
            data: {
                razaoSocial,
                nomeFantasia,
                cnpj: cnpj.replace(/\D/g, ''),
                inscricaoEstadual,
                phone,
                email,
                user: {
                    connect: { id: userId }
                },
                address: {
                    create: {
                        street,
                        number,
                        complement,
                        neighborhood,
                        city,
                        state,
                        cep: cep.replace(/\D/g, ''),
                    }
                }
            }
        });

        req.flash('success_msg', 'Perfil da empresa completado com sucesso! Agora você pode começar a vender.');
        res.redirect('/supplier/dashboard');

    } catch (error) {
        console.error("Erro ao criar empresa:", error);
        req.flash('error_msg', 'Ocorreu um erro ao salvar os dados da sua empresa. Tente novamente.');
        res.redirect('/auth/complete-profile');
    }
};


export const getForgotPasswordForm = (req: Request, res: Response) => {
    res.render('auth/forgot-password', {
        title: 'Recuperar Senha',
        layout: false
    });
};


export const handleForgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            req.flash('success_msg', 'Se um usuário com este e-mail existir, um link de recuperação foi enviado.');
            return res.redirect('/auth/forgot-password');
        }

        const resetToken = randomBytes(20).toString('hex');
        const resetPasswordExpires = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetPasswordExpires
            }
        });

        const resetUrl = `http://${req.headers.host}/auth/reset-password/${resetToken}`;

        await mailer.sendMail({
            to: user.email,
            from: 'nao-responda@marketplace.com',
            subject: 'Recuperação de Senha - Marketplace Industrial',
            html: `
                <p>Você solicitou a redefinição de senha para sua conta no Marketplace Industrial.</p>
                <p>Clique no link a seguir para criar uma nova senha:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
            `
        } );

        req.flash('success_msg', 'Um link de recuperação foi enviado para o seu e-mail.');
        res.redirect('/auth/forgot-password');

    } catch (error) {
        req.flash('error_msg', 'Ocorreu um erro' + error);;
    }
};


export const getResetPasswordForm = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
    
        if (token == null){
          console.log("Something went wrong");
          return ("/auth")
        }

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() }
            }
        });

        if (!user) {
            req.flash('error_msg', 'O link de recuperação de senha é inválido ou expirou.');
            return res.redirect('/auth/forgot-password');
        }

        res.render('auth/reset-password', {
            title: 'Redefinir Senha',
            layout: false
        });

    } catch (error) {
        req.flash('error_msg', 'Ocorreu um erro' + error);;
    }
};


export const handleResetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (token == null){
          console.log("Something went wrong");
          return ("/auth")
        }

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() }
            }
        });

        if (!user) {
            req.flash('error_msg', 'O link de recuperação de senha é inválido ou expirou.');
            return res.redirect('/auth/forgot-password');
        }

        if (password !== confirmPassword) {
            req.flash('error_msg', 'As senhas não coincidem.');
            return res.redirect('back');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        req.flash('success_msg', 'Sua senha foi redefinida com sucesso! Você já pode fazer login.');
        res.redirect('/auth/login');

    } catch (error) {
        req.flash('error_msg', 'Ocorreu um erro' + error);;
    }
};