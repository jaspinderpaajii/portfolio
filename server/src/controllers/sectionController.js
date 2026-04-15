import { ContentSection } from "../models/ContentSection.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getSections = asyncHandler(async (req, res) => {
  const sections = await ContentSection.find().sort({ key: 1 });
  res.json(sections);
});

export const getSectionByKey = asyncHandler(async (req, res) => {
  const section = await ContentSection.findOne({ key: req.params.key });

  if (!section) {
    res.status(404);
    throw new Error("Section not found.");
  }

  res.json(section);
});

export const updateSectionByKey = asyncHandler(async (req, res) => {
  const { data, published } = req.body;

  const section = await ContentSection.findOneAndUpdate(
    { key: req.params.key },
    {
      $set: {
        data,
        ...(typeof published === "boolean" ? { published } : {})
      }
    },
    { new: true, upsert: true }
  );

  res.json(section);
});
