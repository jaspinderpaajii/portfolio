import mongoose from "mongoose";

const contentSectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: ["home", "about", "skills", "contact", "settings"]
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    published: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const ContentSection = mongoose.model("ContentSection", contentSectionSchema);
