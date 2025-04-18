import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const tokenSchema = new mongoose.Schema({
  refreshToken: { type: String, required: true, unique: true },
  exp: { type: Number },
});

tokenSchema.pre("save", function (next) {
  const decodedToken = jwt.decode(this.refreshToken);
  if (typeof decodedToken === "object" && decodedToken?.exp) {
    this.exp = decodedToken.exp * 1000;
  } else {
    next(new Error("Invalid token"));
  }
  next();
});

export default mongoose.model("InvalidToken", tokenSchema);
