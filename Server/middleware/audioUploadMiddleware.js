import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: '../client/public/uploads/audio/',
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `audio-${uniqueSuffix}-${file.originalname}`);
  },
});

// Audio file extensions and MIME types
const allowedAudioExtensions = new Set(['.mp3', '.wav', '.aac', '.ogg', '.m4a', '.flac']);
const allowedAudioMime = new Set([
  'audio/mpeg',
  'audio/wav',
  'audio/aac',
  'audio/ogg',
  'audio/mp4',
  'audio/flac',
  'audio/x-m4a'
]);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isExtOk = allowedAudioExtensions.has(ext);
  const isMimeOk = allowedAudioMime.has(file.mimetype);

  if (isExtOk && isMimeOk) {
    return cb(null, true);
  }

  cb(new Error('Only audio files (MP3, WAV, AAC, OGG, M4A, FLAC) are allowed'));
};

export const audioUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for audio files
  }
});
