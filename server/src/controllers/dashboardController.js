import { ContactMessage } from "../models/ContactMessage.js";
import { ContentSection } from "../models/ContentSection.js";
import { Project } from "../models/Project.js";
import { ShowcaseVideo } from "../models/ShowcaseVideo.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [sections, projects, videos, messages, publishedProjects, publishedVideos] = await Promise.all([
    ContentSection.countDocuments(),
    Project.countDocuments(),
    ShowcaseVideo.countDocuments(),
    ContactMessage.countDocuments(),
    Project.countDocuments({ published: true }),
    ShowcaseVideo.countDocuments({ published: true })
  ]);

  const recentMessages = await ContactMessage.find().sort({ createdAt: -1 }).limit(5);

  res.json({
    metrics: {
      sections,
      projects,
      videos,
      messages,
      publishedProjects,
      publishedVideos
    },
    recentMessages
  });
});
