import express from "express";
import { UserApi } from "../api/userApi";
import { authenticateUser } from "../middlewares/auth";

const router = express.Router();

const userapi = new UserApi();

router.post("/userauth", authenticateUser, userapi.userAuth);
router.post("/user", userapi.getUser);

export default router;
