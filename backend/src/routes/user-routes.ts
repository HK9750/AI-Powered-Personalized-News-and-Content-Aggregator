import express from "express";
import { UserApi } from "../api/userApi";
import { extractUserFromSession } from "../middlewares/auth";

const router = express.Router();

const userapi = new UserApi();

router.post("/userauth", userapi.userAuth);
router.post("/user", extractUserFromSession, userapi.getUser);

export default router;
