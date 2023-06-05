import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import { bucket } from "../config/firebase.js";

const imageUpload = asyncHandler(async (req, res) => {
  try {
    const file = req.file; // Assuming the file is available in the 'file' field of the request

    if (!file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const fileName = `${uuidv4()}-${file.originalname}`;

    const fileUpload = bucket.file(fileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload the image" });
    });

    blobStream.on("finish", async () => {
      const [metadata] = await fileUpload.getMetadata();
      const downloadUrl = metadata.mediaLink;

      res.status(200).json({ downloadUrl });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload the image" });
  }
});

export { imageUpload };
