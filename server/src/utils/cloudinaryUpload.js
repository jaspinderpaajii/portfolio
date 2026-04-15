import streamifier from "streamifier";
import { cloudinary } from "../config/cloudinary.js";

export function uploadBufferToCloudinary(fileBuffer, folder, resourceType = "image") {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type
        });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(upload);
  });
}
