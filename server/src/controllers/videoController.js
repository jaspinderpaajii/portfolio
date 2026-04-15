import { ShowcaseVideo } from "../models/ShowcaseVideo.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { slugify } from "../utils/slugify.js";

async function createUniqueSlug(base, currentId) {
  const raw = slugify(base || "creative");
  let candidate = raw || `creative-${Date.now()}`;
  let counter = 1;

  while (
    await ShowcaseVideo.exists({
      slug: candidate,
      ...(currentId ? { _id: { $ne: currentId } } : {})
    })
  ) {
    candidate = `${raw}-${counter}`;
    counter += 1;
  }

  return candidate;
}

function normalizeCreativePayload(payload) {
  const normalized = { ...payload };
  normalized.assetType = normalized.assetType === "photo" ? "photo" : "video";

  if (normalized.assetType === "photo") {
    if (!normalized.image && normalized.thumbnail) {
      normalized.image = normalized.thumbnail;
    }
    normalized.video = null;
  }

  if (normalized.assetType === "video" && !normalized.thumbnail && normalized.image) {
    normalized.thumbnail = normalized.image;
  }

  return normalized;
}

export const getAdminVideos = asyncHandler(async (req, res) => {
  const items = await ShowcaseVideo.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

export const createVideo = asyncHandler(async (req, res) => {
  const payload = normalizeCreativePayload({ ...req.body });
  payload.slug = await createUniqueSlug(payload.slug || payload.title);

  const video = await ShowcaseVideo.create(payload);
  res.status(201).json(video);
});

export const updateVideo = asyncHandler(async (req, res) => {
  const video = await ShowcaseVideo.findById(req.params.id);

  if (!video) {
    res.status(404);
    throw new Error("Creative item not found.");
  }

  const payload = normalizeCreativePayload({ ...req.body });

  if (payload.title || payload.slug) {
    payload.slug = await createUniqueSlug(payload.slug || payload.title || video.title, video._id);
  }

  Object.assign(video, payload);
  await video.save();

  res.json(video);
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const video = await ShowcaseVideo.findById(req.params.id);

  if (!video) {
    res.status(404);
    throw new Error("Creative item not found.");
  }

  await video.deleteOne();
  res.json({ message: "Video deleted." });
});

export const reorderVideos = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    res.status(400);
    throw new Error("ids must be an array.");
  }

  await Promise.all(ids.map((id, index) => ShowcaseVideo.findByIdAndUpdate(id, { order: index + 1 })));
  const items = await ShowcaseVideo.find().sort({ order: 1, createdAt: -1 });

  res.json(items);
});
