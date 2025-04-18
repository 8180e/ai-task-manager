import User from "../models/user.model.js";
import InvalidToken from "../models/invalidToken.model.js";
import { generate, getUser } from "../utils/tokens.util.js";
import {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from "../utils/errors.util.js";

async function create(userData: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const user = new User(userData);

    await user.save();

    // Generate an access token and a refresh token
    return generate(user._id);
  } catch (error) {
    // Check if the error is a duplicate key error
    if (error instanceof Object && "code" in error && error.code === 11000) {
      throw new ConflictError("Email is already in use");
    }

    throw error;
  }
}

async function authenticate({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Generate an access token and a refresh token
  return generate(user._id);
}

async function refreshTokens(refreshToken: string) {
  const user = await getUser(refreshToken);

  const invalidToken = await InvalidToken.findOne({ refreshToken });

  if (invalidToken) {
    throw new UnauthorizedError("Invalid token");
  }

  // Mark the old refresh token as invalid
  await new InvalidToken({ refreshToken }).save();

  // Remove any expired invalid tokens
  InvalidToken.deleteMany({ exp: { $lt: Date.now() } });

  // Generate a new access token and refresh token
  return generate(user.id);
}

async function get(userId: string) {
  return await User.findById(userId).select("-_id -__v -password");
}

export { create, authenticate, refreshTokens, get };
