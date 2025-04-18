import { beforeAll, afterAll, afterEach, describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../../src/config/env.config";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../../src/models/user.model";
import InvalidToken from "../../../src/models/invalidToken.model";
import app from "../../../src/app";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => await mongod.stop());

afterEach(async () => {
  await User.deleteMany({});
  await InvalidToken.deleteMany({});
});

describe("POST /auth/sign-up", () => {
  it("sends 400 status code if name is not provided", async () => {
    const response = await request(app).post("/auth/sign-up").send({
      name: "",
      email: "test@example.com",
      password: "Password1!",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Name is required");
  });

  it("sends 400 status code if email is invalid", async () => {
    const response = await request(app).post("/auth/sign-up").send({
      name: "John Doe",
      email: "invalid-email",
      password: "Password1!",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid email");
  });

  it("sends 400 status code if password is not strong enough", async () => {
    const response = await request(app).post("/auth/sign-up").send({
      name: "John Doe",
      email: "test@example.com",
      password: "password",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Password is not strong enough");
  });

  it("sends 409 status code if email is already in use", async () => {
    const userData = {
      name: "John Doe",
      email: "test@example.com",
      password: "Password1!",
    };

    await User.create(userData);

    const response = await request(app).post("/auth/sign-up").send(userData);
    expect(response.statusCode).toBe(409);
    expect(response.body.error).toBe("Email is already in use");
  });

  it("sends 201 status code and tokens if user is created successfully", async () => {
    const userData = {
      name: "John Doe",
      email: "test@example.com",
      password: "Password1!",
    };

    const response = await request(app).post("/auth/sign-up").send(userData);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");

    const user = await User.findOne({ email: userData.email });
    expect(user).toBeTruthy();
  });
});

describe("POST /auth/sign-in", () => {
  it("sends 404 status code if email is not found", async () => {
    const response = await request(app).post("/auth/sign-in").send({
      email: "test@example.com",
      password: "Password1!",
    });
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("sends 401 status code if password is incorrect", async () => {
    const userData = {
      name: "John Doe",
      email: "test@example.com",
      password: "Password1!",
    };

    await User.create(userData);

    const response = await request(app).post("/auth/sign-in").send({
      email: userData.email,
      password: "wrong-password",
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid email or password");
  });

  it("sends 200 status code and tokens if authentication is successful", async () => {
    const userData = {
      name: "John Doe",
      email: "test@example.com",
      password: "Password1!",
    };

    await User.create(userData);

    const response = await request(app).post("/auth/sign-in").send({
      email: userData.email,
      password: userData.password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
  });
});

describe("POST /auth/refresh", () => {
  it("sends 401 status code if refresh token is not provided", async () => {
    const response = await request(app).post("/auth/refresh").send({});
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("No token provided");
  });

  it("sends 401 status code if refresh token is invalid", async () => {
    const response = await request(app).post("/auth/refresh").send({
      refreshToken: "invalid-token",
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid token");
  });

  it("sends 401 status code if refresh token is already marked as invalid", async () => {
    const token = jwt.sign({ id: "user-id" }, TOKEN_SECRET, {
      expiresIn: "1h",
    });

    await InvalidToken.create({ refreshToken: token });

    const response = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: token });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid token");
  });

  it(
    "sends 200 status code and new tokens and mark refresh token as invalid " +
      "if refresh token is valid",
    async () => {
      const token = jwt.sign({ id: "user-id" }, TOKEN_SECRET, {
        expiresIn: "1h",
      });

      const response = await request(app)
        .post("/auth/refresh")
        .send({ refreshToken: token });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");

      const invalidToken = await InvalidToken.findOne({ refreshToken: token });
      expect(invalidToken).toBeTruthy();
    }
  );
});
