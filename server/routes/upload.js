import express from "express";
import upload, { handleUploadError } from "../middlewares/multer.js";

const uploadRouter = express.Router();

uploadRouter.post("/single", async (req, res) => {
  try {
    
    upload.single("file")(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res);
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
      }

      return res.status(200).json({
        message: "File uploaded successfully",
        file: req.file,
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unexpected error during file upload",
      error: error.message,
    });
  }
});

export default uploadRouter;
