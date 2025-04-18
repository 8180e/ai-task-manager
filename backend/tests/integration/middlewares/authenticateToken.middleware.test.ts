import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { TOKEN_SECRET } from "../../../src/config/env.config";
import app from "../../../src/app";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => await mongod.stop());

describe("Authenticate Token Middleware", () => {
  it("sends 401 status code if token is not provided", async () => {
    const response = await request(app).get("/tasks");
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("No token provided");
  });

  it("sends 401 status code if token is invalid", async () => {
    const response = await request(app)
      .get("/tasks")
      .set("Authorization", "Bearer invalid-token");
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid token");
  });

  it("sends 200 status code if token is valid", async () => {
    const token = jwt.sign({ id: new mongoose.Types.ObjectId() }, TOKEN_SECRET);

    const response = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});
