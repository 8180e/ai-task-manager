import express from "express";

import authenticateToken from "../middlewares/authenticateToken.middleware.js";

import { get } from "../controllers/user.controller.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", get);

export default router;
