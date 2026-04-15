import dotenv from "dotenv";
import { createApp } from "./app.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { connectDatabase } from "./config/db.js";
import { ensureSeedData } from "./utils/seedDefaults.js";

dotenv.config();

const port = Number(process.env.PORT) || 5000;
const app = createApp();

async function start() {
  await connectDatabase();
  configureCloudinary();
  await ensureSeedData();

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server.");
  console.error(error);
  process.exit(1);
});
