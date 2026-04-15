import { Project } from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { slugify } from "../utils/slugify.js";

async function createUniqueSlug(base, currentId) {
  const raw = slugify(base || "project");
  let candidate = raw || `project-${Date.now()}`;
  let counter = 1;

  while (
    await Project.exists({
      slug: candidate,
      ...(currentId ? { _id: { $ne: currentId } } : {})
    })
  ) {
    candidate = `${raw}-${counter}`;
    counter += 1;
  }

  return candidate;
}

export const getAdminProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json(projects);
});

export const createProject = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  payload.slug = await createUniqueSlug(payload.slug || payload.title);
  const project = await Project.create(payload);

  res.status(201).json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found.");
  }

  const payload = { ...req.body };

  if (payload.title || payload.slug) {
    payload.slug = await createUniqueSlug(payload.slug || payload.title || project.title, project._id);
  }

  Object.assign(project, payload);
  await project.save();

  res.json(project);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found.");
  }

  await project.deleteOne();
  res.json({ message: "Project deleted." });
});

export const reorderProjects = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    res.status(400);
    throw new Error("ids must be an array.");
  }

  await Promise.all(ids.map((id, index) => Project.findByIdAndUpdate(id, { order: index + 1 })));
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });

  res.json(projects);
});
