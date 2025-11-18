import "express-session";
import "express";
import { User, Company } from '@prisma/client';


declare module "express-session" {
  export interface SessionData {
      user: User 
    }
  }

declare global {
  namespace Express {
    interface Locals {
      user: {
        id: string;
        name: string;
        email: string;
        userType?: string;
        company?: any;
        lastLogin: Date | null;
      } | null;
      unreadNotifications: number;
    }
  }
}

