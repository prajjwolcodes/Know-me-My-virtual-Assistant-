import fs from "fs";
import path from "path";
import PdfParse from "pdf-parse";
import { pdfEmbedder } from "../utlls/pdfEmbedder.js";

// Define the directory where files will be stored
const UPLOADS_DIR = "uploads";

export async function pdfParserController(req, res) {
        console.log(req.file);

    try {
        if (!req) {
            return res.status(400).json({ error: "No PDF file uploaded." });
        }

        const uploadedFile = req.file; // Multer makes it available here
        const originalFilename = uploadedFile.originalname;

        const baseFilename = path.parse(originalFilename).name;
        const uploadedPdfName = `${baseFilename}.pdf`;
        const extractedTxtName = `${baseFilename}.txt`;

        const newPdfPath = path.join(UPLOADS_DIR, uploadedPdfName);
        const newTextPath = path.join(UPLOADS_DIR, extractedTxtName);

        if (!fs.existsSync(UPLOADS_DIR)) {
            fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        }

        // Delete existing files
        const filesInUploads = fs.readdirSync(UPLOADS_DIR);
        for (const file of filesInUploads) {
            const filePath = path.join(UPLOADS_DIR, file);
            if (file.endsWith(".pdf") || file.endsWith(".txt")) {
                fs.unlinkSync(filePath);
            }
        }

        // Move the file from Multer's temporary location to your target directory
        fs.renameSync(uploadedFile.path, newPdfPath);

        const dataBuffer = fs.readFileSync(newPdfPath);
        const data = await PdfParse(dataBuffer);

        fs.writeFileSync(newTextPath, data.text, "utf8");

        await pdfEmbedder(extractedTxtName)

        return res.json({
            message: `PDF processed and replaced successfully.`,
            uploadedFilename: uploadedPdfName,
            extractedTextFilename: extractedTxtName
        });
    } catch (err) {
        console.error("Error processing PDF:", err);
        return res.status(500).json({ error: "Failed to process PDF", details: err.message });
    }
  }