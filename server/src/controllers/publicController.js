import { ContactMessage } from "../models/ContactMessage.js";
import { ContentSection } from "../models/ContentSection.js";
import { Project } from "../models/Project.js";
import { ShowcaseVideo } from "../models/ShowcaseVideo.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function sectionsToMap(sections) {
  return sections.reduce((acc, section) => {
    acc[section.key] = {
      id: section._id,
      key: section.key,
      published: section.published,
      updatedAt: section.updatedAt,
      data: section.data
    };
    return acc;
  }, {});
}

export const getSiteSnapshot = asyncHandler(async (req, res) => {
  const sections = await ContentSection.find({ published: true }).sort({ key: 1 });
  const featuredProjects = await Project.find({ published: true, featured: true }).sort({ order: 1, createdAt: -1 });
  const featuredVideos = await ShowcaseVideo.find({ published: true, featured: true }).sort({ order: 1, createdAt: -1 });
  const categories = await ShowcaseVideo.distinct("category", { published: true });

  res.json({
    sections: sectionsToMap(sections),
    featuredProjects,
    featuredVideos,
    showcaseCategories: categories.filter(Boolean)
  });
});

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ published: true }).sort({ order: 1, createdAt: -1 });
  res.json(projects);
});

export const getShowcase = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { published: true };

  if (category && category !== "All") {
    filter.category = category;
  }

  const videos = await ShowcaseVideo.find(filter).sort({ order: 1, createdAt: -1 });
  const categories = await ShowcaseVideo.distinct("category", { published: true });

  res.json({
    items: videos,
    categories: ["All", ...categories.filter(Boolean)]
  });
});

export const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Name, email, and message are required.");
  }

  const contactMessage = await ContactMessage.create({
    name,
    email,
    subject,
    message
  });

  res.status(201).json({
    message: "Message sent successfully.",
    item: contactMessage
  });
});
