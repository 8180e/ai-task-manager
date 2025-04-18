import { beforeAll, afterAll, afterEach, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../src/app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "../../../src/models/user.model";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../../src/config/env.config";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => await mongod.stop());

afterEach(async () => await User.deleteMany({}));

describe("GET /user", () => {
  it("sends 200 status code and user data", async () => {
    const user = new User({
      name: "John Doe",
      email: "test@example.com",
      password: "Password1!",
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, TOKEN_SECRET);
    const response = await request(app)
      .get("/user")
      .set({ authorization: `Bearer ${token}` });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      name: "John Doe",
      email: "test@example.com",
    });
  });
});
