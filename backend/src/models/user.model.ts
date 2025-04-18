import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      match: /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/gm,
    },
    password: {
      type: String,
      required: true,
      match: /^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*\d))(?=(.*[^\w\s]))[\w\W]{8,}$/,
    },
  },
  {
    methods: {
      async comparePassword(password) {
        return await bcrypt.compare(password, this.password);
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

export default mongoose.model("User", userSchema);
