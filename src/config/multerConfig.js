const multer = require('multer');

const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (multer.types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Please upload ${file.mimetype} file`), false);
  }
};

const upload = multer({
  storage,
  fileFilter: multerFilter,
});

exports.uploadFiles = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'file', maxCount: 1 },
]);

// TODO: i try to make a global multer configuration
//       so i hardcode everytime i use it until change it

