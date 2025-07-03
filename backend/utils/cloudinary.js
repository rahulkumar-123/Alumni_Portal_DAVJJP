const cloudinary = require("../config/cloudinary");
const fs = require('fs');

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "alumni_portal_profiles",
      use_filename: true,
    });
    // Delete the temporary file from the server after successful upload
    fs.unlinkSync(file.path);
    return result.secure_url;
  } catch (error) {
    // Ensure temporary file is deleted even if upload fails
    if (file && file.path) {
      fs.unlinkSync(file.path);
    }
    throw new Error("Error uploading to Cloudinary: " + error.message);
  }
};

module.exports = { uploadToCloudinary };