const multer = require('multer');
// Configure multer to specify the destination folder and filename for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'sample/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
// Create a multer upload instance with the configured storage
const upload = multer({ storage }).single('image');
module.exports = upload;