import { vi, afterEach, describe, it, expect } from "vitest";
import {
  create,
  authenticate,
  refreshTokens,
} from "../../../src/services/users.service";
import User from "../../../src/models/user.model";
import { generate, getUser } from "../../../src/utils/tokens.util";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../../src/utils/errors.util";
import InvalidToken from "../../../src/models/invalidToken.model";

vi.mock("../../../src/models/user.model");
vi.mock("../../../src/utils/tokens.util");
vi.mock("../../../src/models/invalidToken.model");

afterEach(() => vi.clearAllMocks());

describe("create user", () => {
  it("creates a new user and generate a token", async () => {
    const user = {
      name: "John Doe",
      email: "test@example.com",
      password: "password",
      save: vi.fn(),
    };
    vi.mocked(User.prototype.constructor).mockReturnValueOnce(user);
    vi.mocked(generate).mockReturnValueOnce({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    const result = await create(user);
    expect(result).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
    expect(user.save).toHaveBeenCalledTimes(1);
    expect(generate).toHaveBeenCalledTimes(1);
  });

  it("throws ConflictError if email is already in use", async () => {
    const userData = {
      name: "John Doe",
      email: "test@example.com",
      password: "password",
    };
    vi.mocked(User.prototype.save).mockRejectedValueOnce({ code: 11000 });

    await expect(create(userData)).rejects.toThrowError(ConflictError);
  });

  it("throws unknown error during user creation", async () => {
    const userData = {
      name: "John Doe",
      email: "test@example.com",
      password: "password",
    };
    vi.mocked(User.prototype.save).mockRejectedValueOnce(
      new Error("Unknown error")
    );

    await expect(create(userData)).rejects.toThrowError("Unknown error");
  });
});

describe("authenticate user", () => {
  it("throws NotFoundError if user is not found", async () => {
    vi.mocked(User.findOne).mockResolvedValueOnce(null);
    await expect(
      authenticate({ email: "test@example.com", password: "password" })
    ).rejects.toThrowError(NotFoundError);
  });

  it("throws UnauthorizedError if password is invalid", async () => {
    const user = { comparePassword: vi.fn().mockResolvedValueOnce(false) };
    vi.mocked(User.findOne).mockResolvedValueOnce(user);
    await expect(
      authenticate({ email: "test@example.com", password: "password" })
    ).rejects.toThrowError(UnauthorizedError);
  });

  it("returns token if authentication is successful", async () => {
    const user = { comparePassword: vi.fn().mockResolvedValueOnce(true) };
    vi.mocked(User.findOne).mockResolvedValueOnce(user);
    vi.mocked(generate).mockReturnValueOnce({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
    const result = await authenticate({
      email: "test@example.com",
      password: "password",
    });
    expect(result).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
  });

  it("throws error if there is an issue retrieving the user", async () => {
    vi.mocked(User.findOne).mockRejectedValueOnce(new Error("Test error"));
    await expect(
      authenticate({ email: "test@example.com", password: "password" })
    ).rejects.toThrowError("Test error");
  });

  it("throws error if there is an issue comparing passwords", async () => {
    const user = {
      comparePassword: vi.fn().mockRejectedValueOnce(new Error("Test error")),
    };
    vi.mocked(User.findOne).mockResolvedValueOnce(user);
    await expect(
      authenticate({ email: "test@example.com", password: "password" })
    ).rejects.toThrowError("Test error");
  });
});

describe("refresh user token", () => {
  it("returns a new token for a valid refresh token", async () => {
    const refreshToken = "valid-refresh-token";
    const user = { id: "user-id" };
    vi.mocked(getUser).mockResolvedValueOnce(user);
    vi.mocked(InvalidToken.findOne).mockResolvedValueOnce(null);
    vi.mocked(generate).mockReturnValueOnce({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });
    const result = await refreshTokens(refreshToken);
    expect(result).toEqual({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });
    expect(InvalidToken).toHaveBeenCalledWith({ refreshToken });
    expect(InvalidToken.prototype.save).toHaveBeenCalledTimes(1);
    expect(InvalidToken.deleteMany).toHaveBeenCalledTimes(1);
  });

  it("throws UnauthorizedError for an invalid refresh token", async () => {
    const refreshToken = "invalid-refresh-token";
    vi.mocked(InvalidToken.findOne).mockResolvedValueOnce(refreshToken);
    await expect(refreshTokens(refreshToken)).rejects.toThrowError(
      UnauthorizedError
    );
    expect(generate).not.toHaveBeenCalled();
  });

  it("throws UnauthorizedError if token is already marked as invalid", async () => {
    const refreshToken = "invalid-refresh-token";
    const invalidToken = { refreshToken };
    vi.mocked(getUser).mockResolvedValueOnce({ id: "user-id" });
    vi.mocked(InvalidToken.findOne).mockResolvedValueOnce(invalidToken);
    await expect(refreshTokens(refreshToken)).rejects.toThrowError(
      UnauthorizedError
    );
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(InvalidToken.findOne).toHaveBeenCalledTimes(1);
  });
});
