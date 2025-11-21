import express, { Application, Request, Response } from "express";
import expressLayouts from "express-ejs-layouts";
import methodOverride from 'method-override';
import path from "path";
import dotenv from "dotenv";
import session from "express-session";
const flash = require("connect-flash");
import { PrismaClient } from "../prisma/.prisma/generated";


// Routes
import { loadUser } from "./middleware/authMiddleware";
import authRoutes from "./routes/authRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import buyerRoutes from './routes/buyerRoutes';
import catalogRoutes from "./routes/catalogRoutes";
import publicRoutes from "./routes/publicRoutes";

dotenv.config();

// Initialize Prisma
const prisma = new PrismaClient();

// Create Express app
const app: Application = express();

// Express config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


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
app.use("/", publicRoutes)
app.use("/auth", authRoutes);
app.use("/buyer", buyerRoutes);
app.use("/supplier", supplierRoutes);
app.use("/catalog", catalogRoutes)


// Test route
app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


