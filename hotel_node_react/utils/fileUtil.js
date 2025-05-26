import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = "uploads";

export const uploadFile = (file, folder) => {
  try {
    const uploadPath = path.join(__dirname, "..", uploadDir, folder);
    const fileName = `${Date.now()}.${file.originalname.split(".").pop()}`;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const filePath = path.join(uploadPath, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return `${uploadDir}/${folder}/${fileName}`;
  } catch (error) {
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
