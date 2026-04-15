import { configureCloudinary } from "../config/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

export const uploadAsset = asyncHandler(async (req, res) => {
  const enabled = configureCloudinary();

  if (!enabled) {
    res.status(400);
    throw new Error("Cloudinary is not configured.");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded.");
  }

  const resourceType = req.body.resourceType || "image";
  const folder =
    resourceType === "video"
      ? "portfolio/showcase"
      : resourceType === "raw"
        ? "portfolio/resume"
        : "portfolio/media";
  const upload = await uploadBufferToCloudinary(req.file.buffer, folder, resourceType);

  res.status(201).json(upload);
});
