import { vi, describe, it, expect } from "vitest";
import { Request, Response } from "express";
import authenticateToken from "../../../src/middlewares/authenticateToken.middleware";
import { getUser } from "../../../src/utils/tokens.util";

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

vi.mock("../../../src/utils/tokens.util", { spy: true });

describe("authenticateToken middleware", () => {
  it("calls next with error if no authorization header", async () => {
    const req = { headers: {} } as Request;
    const next = vi.fn();
    await authenticateToken(req, {} as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it("calls next with error if invalid authorization header format", async () => {
    const req = { headers: { authorization: "invalid" } } as Request;
    const next = vi.fn();
    await authenticateToken(req, {} as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it("calls next with user if valid authorization header and token", async () => {
    const token = "valid-token";
    vi.mocked(getUser).mockResolvedValue({ id: "1" });
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as AuthenticatedRequest;
    const next = vi.fn();
    await authenticateToken(req, {} as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual({ id: "1" });
  });

  it("calls next with error if token validation fails", async () => {
    const token = "invalid-token";
    vi.mocked(getUser).mockImplementation(() => {
      throw new Error("Invalid token");
    });
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    const next = vi.fn();
    await authenticateToken(req, {} as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it("calls next without error if token validation succeeds", async () => {
    const token = "valid-token";
    vi.mocked(getUser).mockResolvedValue({ id: "1" });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const next = vi.fn();
    await authenticateToken(req as Request, {} as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeUndefined();
  });
});
