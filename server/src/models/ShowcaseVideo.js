import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
    resourceType: String
  },
  { _id: false }
);

const showcaseVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    assetType: {
      type: String,
      enum: ["video", "photo"],
      default: "video"
    },
    video: mediaSchema,
    image: mediaSchema,
    thumbnail: mediaSchema,
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const ShowcaseVideo = mongoose.model("ShowcaseVideo", showcaseVideoSchema);
