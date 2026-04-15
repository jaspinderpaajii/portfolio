import { Router } from "express";
import {
  createContactMessage,
  getProjects,
  getShowcase,
  getSiteSnapshot
} from "../controllers/publicController.js";

const router = Router();

router.get("/site", getSiteSnapshot);
router.get("/projects", getProjects);
router.get("/showcase", getShowcase);
router.post("/contact", createContactMessage);

export default router;
