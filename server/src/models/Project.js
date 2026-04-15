import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
    resourceType: String
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    summary: { type: String, required: true },
    description: { type: String, default: "" },
    techStack: [{ type: String }],
    category: { type: String, default: "Project" },
    coverImage: mediaSchema,
    gallery: [mediaSchema],
    links: {
      live: String,
      github: String,
      caseStudy: String
    },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
