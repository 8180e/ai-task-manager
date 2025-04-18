import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { BadRequestError } from "../utils/errors.util.js";

function validationErrorHandler(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new BadRequestError(result.array({ onlyFirstError: true })[0].msg);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export default validationErrorHandler;
