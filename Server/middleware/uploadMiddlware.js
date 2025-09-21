import multer from 'multer';
import path from 'path'

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
const allowedMime = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isExtOk = allowedExtensions.has(ext);
  const isMimeOk = allowedMime.has(file.mimetype);
  if (isExtOk && isMimeOk) return cb(null, true);
  cb(new Error('Only image files are allowed'));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});
