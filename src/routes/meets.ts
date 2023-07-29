import * as meetC from "../controllers/meets"
import express from "express";
import meet from "../models/meet";

const router = express.Router()

router.get("/", meetC.getMeet);
router.get("/:meetid", meetC.getMeetbyID)
router.post("/", meetC.createMeet);
router.patch("/:meetid", meetC.updateMeet);
router.delete("/:meetid", meetC.DeleteMeet);
export default router