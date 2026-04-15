import dotenv from "dotenv";
import { connectDatabase } from "../config/db.js";
import { AdminUser } from "../models/AdminUser.js";

dotenv.config();

async function seedAdmin() {
  await connectDatabase();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }

  const existing = await AdminUser.findOne({ email });

  if (existing) {
    existing.password = password;
    existing.name = name;
    await existing.save();
    console.log("Admin user updated.");
    process.exit(0);
  }

  await AdminUser.create({ email, password, name });
  console.log("Admin user created.");
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
