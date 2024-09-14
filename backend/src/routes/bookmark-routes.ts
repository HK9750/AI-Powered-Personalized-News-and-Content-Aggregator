import express from "express";
import { BookmarkApi } from "../api/bookmarkApi";

const bookmarkApi = new BookmarkApi();

const router = express.Router();

router.get("/user/:userId", bookmarkApi.getBookmarkByUser);
router.post("/upsert", bookmarkApi.createBookmark);
router.get("/all", bookmarkApi.getBookmarks);
router.post("/update/:id", bookmarkApi.updateBookmark);
router.delete("/delete/:id", bookmarkApi.deleteBookmark);

export default router;
