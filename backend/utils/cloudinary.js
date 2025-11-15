import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //it will be used for file handling

console.log("Cloudinary ENV check:", {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing",
});
console.log("Loaded .env keys:", Object.keys(process.env));

cloudinary.config({
    cloud_name: 'daga0ry6c',
    api_key: 551614833276286 || process.env.CLOUDINARY_API_KEY,
    api_secret: 'etqWUBPj-BLc1yA1EYyScsi0klk' || process.env.CLOUDINARY_API_SECRET
});

//To uopload the file what we will do is, first we will store the file in our local server/storage then will upload to cloudinary and then we will delete the file from our local storage
const uploadonCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No local file path provided");
      return null;
    }

    console.log("Uploading file to Cloudinary:", localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("Cloudinary upload successful:", response.secure_url);

    fs.unlinkSync(localFilePath); // cleanup

    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};


export {uploadonCloudinary};