import { body } from "express-validator";

const signupValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isStrongPassword()
    .withMessage("Password is not strong enough"),
];

export default signupValidation;
