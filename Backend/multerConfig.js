const multer = require("multer");
const path = require("path");

const fileUpload = (destination) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}${ext}`;
      cb(null, filename);
    },
  });
  const upload = multer({
    storage: storage,
    // fileFilter: fileFilter,
  });

  return upload;
}

  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const ext = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (ext && mimetype) {
      cb(null, true);
    } else {
      cb("Error: Only JPEG, JPG, and PNG file types are allowed!");
    }
  };

module.exports = fileUpload;