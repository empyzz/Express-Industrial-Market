declare module "connect-flash" {
  import { Request } from "express";

  interface Flash {
    (type: string, message: string | string[]): void;
    (type: string): string[];
  }

  declare global {
    namespace Express {
      interface Request {
        flash: Flash;
      }
    }
  }

  function flash(): any;
  export default flash;
}
