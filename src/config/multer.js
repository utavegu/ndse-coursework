const multer = require('multer');
const path = require('path');

const multerSetup = {
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../public/img'));
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  }
};

const storage = multer.diskStorage(multerSetup);

const allowedTypes = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp'
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
};


module.exports = multer({ storage, fileFilter });
