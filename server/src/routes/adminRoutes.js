import { Router } from "express";
import multer from "multer";
import { getDashboardStats } from "../controllers/dashboardController.js";
import {
  createProject,
  deleteProject,
  getAdminProjects,
  reorderProjects,
  updateProject
} from "../controllers/projectController.js";
import { getSectionByKey, getSections, updateSectionByKey } from "../controllers/sectionController.js";
import { uploadAsset } from "../controllers/uploadController.js";
import {
  createVideo,
  deleteVideo,
  getAdminVideos,
  reorderVideos,
  updateVideo
} from "../controllers/videoController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(requireAuth);

router.get("/dashboard", getDashboardStats);

router.get("/sections", getSections);
router.get("/sections/:key", getSectionByKey);
router.put("/sections/:key", updateSectionByKey);

router.get("/projects", getAdminProjects);
router.post("/projects", createProject);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);
router.patch("/projects/reorder", reorderProjects);

router.get("/videos", getAdminVideos);
router.post("/videos", createVideo);
router.put("/videos/:id", updateVideo);
router.delete("/videos/:id", deleteVideo);
router.patch("/videos/reorder", reorderVideos);

router.post("/upload", upload.single("file"), uploadAsset);

export default router;
