import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = "uploads";

export const uploadFile = async (file, folder) => {
  try {
    const uploadPath = path.join(__dirname, "..", uploadDir, folder);
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const filePath = path.join(uploadPath, fileName);

    // Check if file is an image
    if (file.mimetype.startsWith("image/")) {
      let transformer = sharp(file.buffer);

      switch (fileExt.toLowerCase()) {
        case "jpg":
        case "jpeg":
          transformer = transformer.jpeg({ quality: 70 });
          break;
        case "png":
          transformer = transformer.png({ quality: 70, compressionLevel: 8 });
          break;
        case "webp":
          transformer = transformer.webp({ quality: 70 });
          break;
        case "gif":
          // sharp can read GIF but only output as PNG/WebP/JPEG, so just convert to webp for compression
          transformer = transformer.webp({ quality: 70 });
          break;
        default:
          // For other image formats, convert to webp as a fallback
          transformer = transformer.webp({ quality: 70 });
          break;
      }

      await transformer.toFile(filePath);
    } else {
      // Not an image — save the file as is
      fs.writeFileSync(filePath, file.buffer);
    }

    return `${uploadDir}/${folder}/${fileName}`;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};

export const deleteFile = (filePath) => {
  try {
    const fullPath = path.join(__dirname, "..", filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.log(error);
  }
};

export const moveToCache = (filePath) => {
  try {
    let name = filePath.split("/").pop();

    const fullPath = path.join(__dirname, "..", filePath);

    const uploadPath = path.join(__dirname, "..", uploadDir, "temp");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    fs.renameSync(fullPath, path.join(uploadPath, name));
  } catch (error) {
    console.log(error);
  }
};

export const moveFromCache = (filePath) => {
  try {
    let name = filePath.split("/").pop();

    const fullPath = path.join(__dirname, "..", filePath);

    const uploadPath = path.join(__dirname, "..", uploadDir, "temp");

    fs.renameSync(path.join(uploadPath, name), fullPath);
  } catch (error) {
    console.log(error);
  }
};
