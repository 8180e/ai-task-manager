import { Request, Response, NextFunction } from "express";
import { getUser } from "../utils/tokens.util.js";

async function authenticateToken(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // Validate the token and get the associated user.
    req.user = await getUser(token);

    next();
  } catch (error) {
    next(error);
  }
}

export default authenticateToken;
