const cloudinary = require('cloudinary').v2;


// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true
});

// Log the configuration
/* console.log(cloudinary.config()); */


exports.uploadImage = async (imagePath) => {

  // Use the uploaded file's name as the asset's public ID and 
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    return { 
      public_id:result.public_id ,
      url :result.secure_url };
  } catch (error) {
    console.error(error);
  }
};

exports.deleteImage = async (image_name) => {
  try {
    await cloudinary.api
      .delete_resources([image_name], 
        { type: 'upload', resource_type: 'image' })
      .then(console.log('Image deleted successfully'));
  }
  catch (error) {
    console.error(error);
  }
};

