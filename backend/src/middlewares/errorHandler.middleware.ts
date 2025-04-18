import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/errors.util.js";

function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message || "" });
}

export default errorHandler;
