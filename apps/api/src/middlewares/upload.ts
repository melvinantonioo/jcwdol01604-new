import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary';

// Konfigurasi storage Cloudinary dengan fungsi untuk params
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: 'property_listings', // Folder di Cloudinary untuk menyimpan gambar properti
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif'], // Gunakan allowedFormats (camelCase)
    }),
});

const upload = multer({ storage });

export default upload;
