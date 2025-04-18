import express from "express";

import signupValidation from "../middlewares/validations/auth.validation.middleware.js";
import validationErrorHandler from "../middlewares/validationErrorHandler.middleware.js";

import { signup, signin, refresh } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", signupValidation, validationErrorHandler, signup);
router.post("/sign-in", signin);
router.post("/refresh", refresh);

export default router;
