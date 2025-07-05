const cloudinary = require("../config/cloudinary");
const fs = require('fs');

const uploadToCloudinary = async (file) => {
  if (!file || !file.path) {
    throw new Error("Invalid file input");
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "alumni_portal_profiles",
      use_filename: true,
    });

    // Clean up temporary file
    await fs.promises.unlink(file.path);

    return result.secure_url;
  } catch (error) {
    // Clean up file even if upload fails
    try {
      await fs.promises.unlink(file.path);
    } catch (unlinkErr) {
      console.warn("Failed to delete temp file:", unlinkErr);
    }

    throw new Error("Error uploading to Cloudinary: " + error.message);
  }
};

module.exports = { uploadToCloudinary };
