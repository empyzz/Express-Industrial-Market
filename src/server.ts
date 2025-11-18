import express, { Application, Request, Response } from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";
const flash = require("connect-flash");
import { PrismaClient } from "../prisma/.prisma/generated";



import { loadUser } from "./middleware/authMiddleware";
import authRoutes from "./routes/authRoutes";


dotenv.config();

// Initialize Prisma
const prisma = new PrismaClient();

// Create Express app
const app: Application = express();

// Express config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as template engine
app.set("view engine", "ejs");
app.set("views", path.join("src", "views"));

// Use expressLayouts
app.use(expressLayouts);
app.set("layout", "layout/main");

// Static files (CSS, JS, images)
app.use(express.static(path.join(process.cwd(), "src", "public")));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
    },
  })
);

// Flash Messages
app.use(flash());

// Load User
app.use(loadUser);

app.use((req, res, next) => {
  res.locals.error_msg = req.flash("error_msg");
  res.locals.success_msg = req.flash("success_msg");
  res.locals.formData = req.flash("formData");
  next();
});

// Login route
app.use("/auth", authRoutes);

// Home route
app.get("/", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany().catch(() => []);
    res.render("index", {
      title: "Home Page",
      users,
    });
  } catch (error) {
    console.error("Home route error:", error);
    res.status(500).send("Internal server error");
  }
});

// Test route
app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


