import express from "express"
import fs from "fs";

import { pdfParserController } from "../controllers/pdfParserController.js"
import multer from "multer";
import { pdfAnswerController } from "../controllers/pdfAnswerController.js";


const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads_temp'; // Temporary directory for Multer
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Use a unique temp name
  }
});

const upload = multer({ storage: storage });


router.route("/upload").post( upload.single("file"),pdfParserController)
router.route("/pdfanswer").post(pdfAnswerController)

export default router 