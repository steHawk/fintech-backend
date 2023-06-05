import express from "express";
import { imageUpload } from "../controllers/serviceController.js";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const serviceRoutes = express.Router();

serviceRoutes.post("/image-upload", upload.single("image"), imageUpload);

export default serviceRoutes;
