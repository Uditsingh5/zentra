import express from 'express';
import upload from '../middlewares/multer.js';

const uploadRouter = express.Router();

// single file upload

uploadRouter.post("/single", upload.single("file"), (req, res) => {
   try {
      console.log(req.file);
      return res.status(200).json({
         message: "File uploaded successfully",
         file: req.file
      });
   } catch (error) {
      return res.status(500).json({
         message: "File upload failed",
         error: error.message
      });
   }
});

export default uploadRouter;