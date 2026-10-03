import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const uploadDir = path.resolve('server/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${safe}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      const error = new Error('Please upload a JPG, PNG, or WebP image.');
      error.status = 400;
      cb(error);
      return;
    }
    cb(null, true);
  },
});

export function removeUpload(imagePath) {
  if (!imagePath?.startsWith('/uploads/')) return;
  const file = path.resolve(uploadDir, path.basename(imagePath));
  fs.promises.unlink(file).catch(() => {});
}
