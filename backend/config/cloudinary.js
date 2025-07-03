const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuration for user profile pictures
const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'alumni-portal/user-profiles',
    format: 'jpg',
    public_id: (req, file) => `user-${req.user.id}-${Date.now()}`,
  },
});

// Configuration for post images (if you add this feature later)
const postStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'alumni-portal/post-images',
    format: 'jpg',
    public_id: (req, file) => `post-${req.user.id}-${Date.now()}`,
  },
});

const uploadUser = multer({ storage: userStorage });
const uploadPost = multer({ storage: postStorage });

// Correctly export both uploader instances
module.exports = { uploadUser, uploadPost };

