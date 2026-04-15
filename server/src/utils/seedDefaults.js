import { DEFAULT_PROJECTS, DEFAULT_SECTIONS, DEFAULT_VIDEOS } from "../data/defaultContent.js";
import { AdminUser } from "../models/AdminUser.js";
import { ContentSection } from "../models/ContentSection.js";
import { Project } from "../models/Project.js";
import { ShowcaseVideo } from "../models/ShowcaseVideo.js";

export async function ensureDefaultSections() {
  const entries = Object.entries(DEFAULT_SECTIONS);

  await Promise.all(
    entries.map(async ([key, data]) => {
      const existing = await ContentSection.findOne({ key });

      if (!existing) {
        await ContentSection.create({ key, data, published: true });
      }
    })
  );
}

export async function ensureDefaultProjects() {
  const count = await Project.countDocuments();

  if (count === 0 && DEFAULT_PROJECTS.length) {
    await Project.insertMany(DEFAULT_PROJECTS);
  }
}

export async function ensureDefaultVideos() {
  const count = await ShowcaseVideo.countDocuments();

  if (count === 0 && DEFAULT_VIDEOS.length) {
    await ShowcaseVideo.insertMany(DEFAULT_VIDEOS);
  }
}

export async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    return;
  }

  const existing = await AdminUser.findOne({ email });

  if (!existing) {
    await AdminUser.create({ email, password, name });
  }
}

export async function ensureSeedData() {
  await ensureDefaultSections();
  await ensureDefaultProjects();
  await ensureDefaultVideos();
  await ensureAdminUser();
}
