import Task from "../models/task.model.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.util.js";

async function get(userId: string, taskId: string) {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  if (!task.userId.equals(userId)) {
    throw new ForbiddenError("You do not have permission to change this task");
  }

  return task;
}

async function getAll(userId: string) {
  return await Task.find().byUserId(userId);
}

async function create(
  userId: string,
  taskData: { category: string; description: string }
) {
  const task = new Task({ userId, ...taskData });

  await task.save();

  return await getAll(userId);
}

async function update(
  userId: string,
  taskId: string,
  taskData: {
    category: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    urgency: "urgent" | "normal";
  }
) {
  const task = await get(userId, taskId);

  // Update the task with the new data
  Object.assign(task, taskData);

  await task.save();

  return await getAll(userId);
}

async function remove(userId: string, taskId: string) {
  const task = await get(userId, taskId);

  await task.deleteOne();

  return await getAll(userId);
}

export { get, getAll, create, update, remove };
