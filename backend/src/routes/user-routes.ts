import express from "express";
import { UserApi } from "../api/userApi";

const userRouter = express.Router();

const userapi = new UserApi();

userRouter.post("/userauth", userapi.userAuth.bind(userapi));
userRouter.post("/user", userapi.getUser.bind(userapi));

export default userRouter;
