import { Request, Response, NextFunction } from "express";
import {
  getAll,
  create as createTask,
  update as updateTask,
  remove as removeTask,
} from "../services/tasks.service.js";

async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await getAll(req.user!.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await createTask(req.user!.id, req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id;
    const task = req.body;

    const result = await updateTask(userId, taskId, task);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id;

    const result = await removeTask(userId, taskId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export { get, create, update, remove };
