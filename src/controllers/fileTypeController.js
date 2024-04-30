const FileType = require('../models/fileTypeModel');

exports.addFileType = async (req, res, next) => {
  await FileType.create({
    file_id: req.fileId,
    file_type: req.fileType,
    file_type_id: req.fileTypeId,
    createdAt: Date.now(),
  });
};
