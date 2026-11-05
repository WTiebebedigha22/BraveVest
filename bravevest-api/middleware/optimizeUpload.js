import sharp from 'sharp';
import path from 'path';

export async function optimizeUpload(req, res, next) {
  if (!req.file) return next();
  try {
    const out = path.join(req.file.destination, req.file.filename + '.webp');
    await sharp(req.file.path)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
    req.file.optimizedPath = out;
  } catch (e) {
    console.error('optimizeUpload:', e);
  }
  next();
}
