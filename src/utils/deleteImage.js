const fs = require('fs');
const catchAsync = require('./catchAsync');

module.exports = catchAsync(async (filePath) => {
  // Check if the file exists
  console.log('file exist? ',fs.existsSync(filePath));
  if (fs.existsSync(filePath)) {
    // Use fs.unlink to delete the file
    await fs.promises.unlink(filePath);

    return true; // file was successfully deleted
  }

  return false; // file does not exist
});
