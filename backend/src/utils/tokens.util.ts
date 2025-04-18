import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/env.config.js";
import { UnauthorizedError } from "./errors.util.js";

function generate(id: string | mongoose.Types.ObjectId) {
  return {
    accessToken: jwt.sign({ id }, TOKEN_SECRET, { expiresIn: "1h" }),
    refreshToken: jwt.sign({ id }, TOKEN_SECRET, { expiresIn: "1w" }),
  };
}

async function getUser(token: string | undefined) {
  if (!token) {
    throw new UnauthorizedError("No token provided");
  }

  try {
    // Verify the token and extract user information
    const user = await new Promise((resolve, reject) => {
      jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    return user as { id: string };
  } catch {
    // Handle errors related to token verification
    throw new UnauthorizedError("Invalid token");
  }
}

export { generate, getUser };
