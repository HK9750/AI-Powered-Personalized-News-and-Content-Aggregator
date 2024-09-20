import express from "express";
import { PreferencesApi } from "../api/preferencesApi";
import { authenticateUser } from "../middlewares/auth";

const router = express.Router();

const preferencesapi = new PreferencesApi();

router.post("/all", authenticateUser, preferencesapi.getPreferences);
router.post("/create", authenticateUser, preferencesapi.createPreferences);
router.put("/update", authenticateUser, preferencesapi.updatePreferences);
router.delete("/delete", authenticateUser, preferencesapi.deletePreferences);

export default router;
