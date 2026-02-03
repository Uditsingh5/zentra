import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// multer ke liye storage bnao
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ZentraUploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif']
  }
});

// ye storage multer ko dena hai
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      const err = new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.');
      err.code = 'INVALID_FILE_TYPE';
      return cb(err);
    }
    cb(null, true);
  }
});


export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer internal errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Max size is 5MB.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // Cloudinary errors
    console.error('Upload Error:', err);
    if (err.code === 'INVALID_FILE_TYPE') {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: 'File upload failed. Please try again.' });
  }
  next();
};

export default upload;
