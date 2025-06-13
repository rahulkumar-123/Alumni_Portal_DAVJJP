const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "alumni_portal",
      use_filename: true,
    });
    return result.secure_url;
  } catch (error) {
    throw new Error("Error uploading to Cloudinary");
  }
};

module.exports = { uploadToCloudinary };
