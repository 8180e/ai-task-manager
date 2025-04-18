import { describe, it, vi, expect } from "vitest";
import { Request, Response } from "express";
import { validationResult, Result } from "express-validator";
import { BadRequestError } from "../../../src/utils/errors.util";
import validationErrorHandler from "../../../src/middlewares/validationErrorHandler.middleware";

vi.mock("express-validator");
vi.mock("../../../src/utils/errors.util");

describe("validationErrorHandler", () => {
  it("calls next when validation result is empty", () => {
    const req = { body: {} } as Request;
    const res = {} as Response;
    const next = vi.fn();
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => true,
    } as Result);
    validationErrorHandler(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeUndefined();
  });

  it("throws BadRequestError when validation result is not empty", () => {
    const req = { body: {} } as Request;
    const res = {} as Response;
    const next = vi.fn();
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Error message" }],
    } as Result);
    validationErrorHandler(req, res, next);
    expect(BadRequestError).toHaveBeenCalledTimes(1);
  });

  it("calls next with error when BadRequestError is thrown", () => {
    const req = { body: {} } as Request;
    const res = {} as Response;
    const next = vi.fn();
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Error message" }],
    } as Result);
    validationErrorHandler(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(BadRequestError);
  });

  it("calls next with error when any other error is thrown", () => {
    const req = { body: {} } as Request;
    const res = {} as Response;
    const next = vi.fn();
    const error = new Error("Test error");
    vi.mocked(validationResult).mockImplementation(() => {
      throw error;
    });
    validationErrorHandler(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBe(error);
  });
});
