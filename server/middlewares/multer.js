import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// multer ke liye storage bnao

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params:{
    folder: 'ZentraUploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp', 'pdf', 'doc', 'docx']
  }
})


// ye storage multer ko dena hai
const upload = multer({ storage: storage });
export default upload;