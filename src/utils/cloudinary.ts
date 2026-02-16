
import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer (Memory Storage)
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed!'));
        }
    }
});

/**
 * Upload a file buffer to Cloudinary
 * @param fileBuffer The file buffer from multer
 * @param folder The folder in Cloudinary
 * @returns The secure URL of the uploaded file
 */
export const uploadToCloudinary = async (fileBuffer: Buffer, folder: string = 'scholarships'): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'auto' },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error('Cloudinary upload failed'));
                resolve(result.secure_url);
            }
        );
        uploadStream.end(fileBuffer);
    });
};
