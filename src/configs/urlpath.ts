import dotenv from "dotenv";
dotenv.config();

const IMAGE_URL = process.env.BACKEND_IMAGE_URL;
const AUDIOS_URL = process.env.AUDIOS_URL;
const IMAGES_URL = process.env.IMAGES_URL;
const VIDEOS_URL = process.env.VIDEOS_URL;

export { IMAGE_URL, AUDIOS_URL, IMAGES_URL, VIDEOS_URL };
