import { Request, Response, NextFunction } from "express";
import {
  create,
  authenticate,
  refreshTokens,
} from "../services/users.service.js";

async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { accessToken, refreshToken } = await create(req.body);

    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
}

async function signin(req: Request, res: Response, next: NextFunction) {
  try {
    const tokens = await authenticate(req.body);

    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
}

async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const tokens = await refreshTokens(req.body.refreshToken);

    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
}

export { signup, signin, refresh };
