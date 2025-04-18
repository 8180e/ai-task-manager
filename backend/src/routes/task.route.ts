import express from "express";

import authenticateToken from "../middlewares/authenticateToken.middleware.js";
import {
  taskValidation,
  taskIdValidation,
} from "../middlewares/validations/task.validation.middleware.js";
import validationErrorHandler from "../middlewares/validationErrorHandler.middleware.js";

import { get, create, update, remove } from "../controllers/task.controller.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", get);
router.post("/", taskValidation, validationErrorHandler, create);
router.put(
  "/:id",
  taskIdValidation,
  taskValidation,
  validationErrorHandler,
  update
);
router.delete("/:id", taskIdValidation, validationErrorHandler, remove);

export default router;
