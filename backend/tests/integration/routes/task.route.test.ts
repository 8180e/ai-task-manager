import { beforeAll, afterAll, describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../../src/app";
import { TOKEN_SECRET } from "../../../src/config/env.config";
import User from "../../../src/models/user.model";
import Task from "../../../src/models/task.model";

const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

let mongod: MongoMemoryServer, user: mongoose.Document, token: string;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();

  await mongoose.connect(uri);

  user = new User({
    name: "John Doe",
    email: "test@example.com",
    password: "Password1!",
  });

  token = jwt.sign({ id: user._id }, TOKEN_SECRET);

  await user.save();
});

afterAll(async () => await mongod.stop());

afterEach(async () => Task.deleteMany({}));

describe("GET /tasks", () => {
  it("sends 200 status code and tasks", async () => {
    await Task.create({
      userId: user._id,
      category: "test",
      description: "test task 1",
      dueDate: tomorrow,
    });

    const response = await request(app)
      .get("/tasks")
      .set({ authorization: `Bearer ${token}` });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });
});

describe("POST /tasks", () => {
  it("sends 201 status code and tasks", async () => {
    const response = await request(app)
      .post("/tasks")
      .set({ authorization: `Bearer ${token}` })
      .send({
        category: "test",
        description: "test task 1",
        dueDate: tomorrow,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveLength(1);
  });
});

describe("PUT /tasks/:id", () => {
  it("sends 200 status code and tasks", async () => {
    const task = await Task.create({
      userId: user._id,
      category: "test",
      description: "test task 1",
      dueDate: tomorrow,
    });

    const response = await request(app)
      .put(`/tasks/${task._id}`)
      .set({ authorization: `Bearer ${token}` })
      .send({
        category: "test",
        description: "test task 2",
        dueDate: tomorrow,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].description).toBe("test task 2");
  });

  it("sends 404 status code if task is not found", async () => {
    const response = await request(app)
      .put(`/tasks/${new mongoose.Types.ObjectId()}`)
      .set({ authorization: `Bearer ${token}` })
      .send({
        category: "test",
        description: "test task 2",
        dueDate: tomorrow,
      });
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Task not found");
  });

  it("sends 403 status code if user ids do not match", async () => {
    const unauthorizedToken = jwt.sign(
      { id: new mongoose.Types.ObjectId() },
      TOKEN_SECRET
    );
    const task = await Task.create({
      userId: user._id,
      category: "test",
      description: "test task 1",
      dueDate: tomorrow,
    });

    const response = await request(app)
      .put(`/tasks/${task._id}`)
      .set({ authorization: `Bearer ${unauthorizedToken}` })
      .send({
        category: "test",
        description: "test task 2",
        dueDate: tomorrow,
      });
    expect(response.statusCode).toBe(403);
    expect(response.body.error).toBe(
      "You do not have permission to change this task"
    );
  });
});

describe("DELETE /tasks/:id", () => {
  it("sends 200 status code and tasks", async () => {
    const task = await Task.create({
      userId: user._id,
      category: "test",
      description: "test task 1",
      dueDate: tomorrow,
    });

    const response = await request(app)
      .delete(`/tasks/${task._id}`)
      .set({ authorization: `Bearer ${token}` });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it("sends 404 status code if task is not found", async () => {
    const response = await request(app)
      .delete(`/tasks/${new mongoose.Types.ObjectId()}`)
      .set({ authorization: `Bearer ${token}` });
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Task not found");
  });

  it("sends 403 status code if user ids do not match", async () => {
    const unauthorizedToken = jwt.sign(
      { id: new mongoose.Types.ObjectId() },
      TOKEN_SECRET
    );
    const task = await Task.create({
      userId: user._id,
      category: "test",
      description: "test task 1",
      dueDate: tomorrow,
    });

    const response = await request(app)
      .delete(`/tasks/${task._id}`)
      .set({ authorization: `Bearer ${unauthorizedToken}` });
    expect(response.statusCode).toBe(403);
    expect(response.body.error).toBe(
      "You do not have permission to change this task"
    );
  });
});
