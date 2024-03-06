const fs = require('fs');
const catchAsync = require('./catchAsync');

const deleteImage = catchAsync(async (filePath) => {
  fs.unlinkSync(filePath);
});

module.exports = deleteImage;
