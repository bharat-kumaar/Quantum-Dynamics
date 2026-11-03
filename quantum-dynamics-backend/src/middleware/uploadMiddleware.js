const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists automatically
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const projectId = req.body?.projectId;
    const prefix = projectId ? `${projectId}___` : 'general___';
    // Using originalname for filename, but sanitized for security
    const sanitizedName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${prefix}${Date.now()}-${sanitizedName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  // Define allowed types
  const allowedExtensions = new Set(['.jpeg', '.png', '.jpg', '.webp', '.mp4', '.mkv', '.webm', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip']);
  const allowedZipMimes = new Set(['application/zip', 'application/x-zip-compressed', 'multipart/x-zip']);

  // Check if extension OR mimetype is valid
  const isExtensionValid = allowedExtensions.has(ext);
  const isZipValid = allowedZipMimes.has(mime);

  if (isExtensionValid || isZipValid) {
    return cb(null, true);
  } else {
    return cb(
      new Error(
        'Invalid file type. Upload only images (jpeg, png, jpg, webp), videos (mp4, mkv, webm), documents (pdf, doc, docx, xls, xlsx), and zip archives.'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

module.exports = upload;