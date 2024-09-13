import express from "express";
import { UserApi } from "../api/userApi";

const router = express.Router();

const userapi = new UserApi();

router.post("/userauth", userapi.userAuth);
router.post("/user", userapi.getUser);

export default router;
