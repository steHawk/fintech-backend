import admin from "firebase-admin";
import path from "path";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICE_ACCOUNT_PATH = path.join(__dirname, "../../firebase.json");

const serviceAccount = JSON.parse(
  readFileSync(SERVICE_ACCOUNT_PATH, {
    encoding: "utf8",
    flag: "r",
  })
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const bucket = admin.storage().bucket("yt-ups.appspot.com"); // Replace "your-storage-bucket" with your Firebase storage bucket name

export { bucket };
