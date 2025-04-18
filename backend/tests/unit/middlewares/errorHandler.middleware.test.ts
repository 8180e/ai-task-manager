import { vi, describe, it, expect, afterEach } from "vitest";
import { Request, Response } from "express";
import { HttpError, NotFoundError } from "../../../src/utils/errors.util";
import errorHandler from "../../../src/middlewares/errorHandler.middleware";

vi.spyOn(console, "error");

afterEach(() => vi.clearAllMocks());

describe("errorHandler middleware", () => {
  it(
    "logs error stack and send 500 status code with error message if " +
      "statusCode is not provided",
    () => {
      const err = new HttpError("Test error");
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as Partial<Response> as Response;
      errorHandler(err, {} as Request, res, () => {});
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: "Test error" });
    }
  );

  it("logs error stack and send provided status code with error message", () => {
    const err = new NotFoundError("Test error");
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as Partial<Response> as Response;
    errorHandler(err, {} as Request, res, () => {});
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: "Test error" });
  });

  it(
    "logs error stack and send 500 status code with empty error message if " +
      "message is not provided",
    () => {
      const err = {} as HttpError;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as Partial<Response> as Response;
      errorHandler(err, {} as Request, res, () => {});
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: "" });
    }
  );
});
