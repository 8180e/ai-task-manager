import { Request, Response, NextFunction } from "express";
import { get as getUser } from "../services/users.service.js";

async function get(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await getUser(req.user!.id));
  } catch (error) {
    next(error);
  }
}

export { get };
