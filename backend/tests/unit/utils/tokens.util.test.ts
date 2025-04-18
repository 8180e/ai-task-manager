import { vi, describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../../src/utils/errors.util";
import { getUser } from "../../../src/utils/tokens.util";

vi.spyOn(jwt, "verify");

describe("getUser function", () => {
  it("throws an error when no token is provided", async () => {
    await expect(() => getUser(undefined)).rejects.toThrowError(
      UnauthorizedError
    );
    await expect(() => getUser(undefined)).rejects.toThrowError(
      "No token provided"
    );
  });

  it("throws an error when an invalid token is provided", async () => {
    const invalidToken = "invalid-token";
    vi.mocked(jwt.verify).mockImplementation((_token, _secret, callback) =>
      (callback as jwt.VerifyCallback)(
        new Error("Invalid token") as jwt.VerifyErrors
      )
    );
    await expect(() => getUser(invalidToken)).rejects.toThrowError(
      UnauthorizedError
    );
    await expect(() => getUser(invalidToken)).rejects.toThrowError(
      "Invalid token"
    );
  });

  it("returns a user when a valid token is provided", async () => {
    const validToken = "valid-token";
    const user = { id: "user-id" };
    vi.mocked(jwt.verify).mockImplementation((_token, _secret, callback) =>
      (callback as jwt.VerifyCallback)(null, user)
    );
    await expect(getUser(validToken)).resolves.toEqual(user);
  });
});
