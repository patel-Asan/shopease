
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ShopEase-collective/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit', quality: 'auto' }],
    public_id: (req, file) => `profile-${Date.now()}`,
  },
});

const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ShopEase-collective/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit', quality: 'auto' }],
    public_id: (req, file) => `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only images allowed'), false);
};

const uploadProfile = multer({ storage: profileStorage, fileFilter });
const uploadProduct = multer({ storage: productStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { cloudinary, uploadProfile, uploadProduct };
