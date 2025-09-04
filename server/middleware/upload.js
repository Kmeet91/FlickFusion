import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Create storage engine
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = `avatar-${req.user.id}${path.extname(file.originalname)}`;
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads' // Match the collection name
            };
            resolve(fileInfo);
        });
    }
});

const upload = multer({ storage });

export default upload;