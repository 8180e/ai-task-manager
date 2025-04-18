import mongoose from "mongoose";

import getUrgency from "../services/nlp.service.js";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (value: mongoose.Types.ObjectId) {
          return !!(await mongoose.model("User").exists({ _id: value }));
        },
      },
    },
    category: { type: String, required: true, minLength: 3 },
    description: { type: String, required: true, minLength: 10 },
    dueDate: { type: Date, required: true, min: Date.now() },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    urgency: { type: String, enum: ["urgent", "normal"], default: "normal" },
    userReminded: { type: Boolean, default: false },
  },
  {
    query: {
      byUserId(userId) {
        return this.where({ userId });
      },
    },
  }
);

taskSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.userId;
    return ret;
  },
});

taskSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      this.urgency = await getUrgency(this);
    }
  } finally {
    next();
  }
});

export default mongoose.model("Task", taskSchema);
