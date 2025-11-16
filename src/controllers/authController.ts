import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

// Login controller

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.render("auth/login", { 
        error: "Email and password required", 
        title:"Login" 
      });
      return;
    }

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.render("auth/login", {
        error: "User not found",
        title:"Login"
      });
      return;
    }

    // 2. Validate password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
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
    };

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("auth/login", {
      error: "Something went wrong!",
      title:"Login"
    });
  }
};

// Register controller
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, type, phone } = req.body;

    const userType = type; // form → db mapping

    if (!name || !email || !password || !userType) {
      res.render("auth/register", {
        title: "Register",
        error: "Please fill all required fields",
      });
      return;
    }

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
        emailVerified: false,
        isActive: true,
      },
    });

    // Auto-login
    req.session.user = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("auth/register", {
      title: "Register",
      error: "Error creating your account",
    });
  }
};
