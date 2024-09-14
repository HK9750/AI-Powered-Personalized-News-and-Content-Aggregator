import express from "express";
import { DashBoardConfigApi } from "../api/dashboardConfigApi";

const dashboardConfigApi = new DashBoardConfigApi();
const router = express.Router();

router.get("/user", dashboardConfigApi.getDashboardConfig);
router.post("/upsert", dashboardConfigApi.createOrUpdateDashboardConfig);
router.delete("/delete/:userId", dashboardConfigApi.deleteDashboardConfig);

export default router;
