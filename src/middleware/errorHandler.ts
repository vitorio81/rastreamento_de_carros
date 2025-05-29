import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
}
