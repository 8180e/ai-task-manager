import { param, body } from "express-validator";

const taskValidation = [
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 3 })
    .withMessage("Category must be at least 3 characters long"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("dueDate")
    .isISO8601()
    .withMessage("Invalid date format")
    .custom((value) => new Date(value) > new Date())
    .withMessage("Date must be in the future"),
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be one of: pending, in-progress, completed"),
  body("urgency")
    .optional()
    .isIn(["urgent", "normal"])
    .withMessage("Urgency must be one of: urgent, normal"),
  body("userReminded")
    .optional()
    .isBoolean()
    .withMessage("User Reminded must be true or false"),
];

const taskIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("Task ID is required")
    .isMongoId()
    .withMessage("Invalid Task ID format"),
];

export { taskValidation, taskIdValidation };
