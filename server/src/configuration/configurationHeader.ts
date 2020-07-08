import { Request, Response, NextFunction } from "express";

export const configurationHeader = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Accept,X-Requested-with,Content-Type,Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
};
