import multer from 'multer';
import path from 'path';
import { publicFolder } from '../startup/config';
import { Request, Response, NextFunction } from 'express';
import { existsSync, mkdirSync } from 'fs';

// IMAGE TYPES
const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg'];

const getUploadFileTypes = (uploadFileType: number) => {
    if (uploadFileType === 1) {
        return imageTypes;
    }
    return [];
};

export const UploadFile = (folderPath: string, param: string, uploadFileType: number) => {

    // DIRECTORY PATH
    const dirPath: string = publicFolder + "/" + folderPath;

    // CHECK IF DIRECTORY EXIST OR NOT
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath);
    }

    // SET UP MULTER STORAGE
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, dirPath);
        },
        filename: (req, file, cb) => {
            cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname));
        }
    });

    // FILE TYPE VALIDATION
    const fileFilter = (req, file, cb) => {
        const allowedTypes = getUploadFileTypes(uploadFileType);
        // CHECK IF THE UPLOADED FILE'S MIME TYPE MATCHES THE ALLOWED TYPES
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // ACCEPT THE FILE
        } else {
            cb(new Error(`Invalid file type. Allowed types: ${JSON.stringify(allowedTypes)}`), false); // REJECT THE FILE
        }
    };

    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        // limits: {
        //     fileSize: 1024 * 1024 * 1 // 1MB (ADJUST AS NEEDED)
        // },
    });

    // RETURN MIDDLEWARE FUNCTION
    return (req: Request, res: Response, next: NextFunction) => {
        // EXECUTE UPLOAD AND HANDLE ERRORS
        upload.single(param)(req, res, (err: any) => {
            if (err instanceof multer.MulterError) {
                // MULTER-SPECIFIC ERRORS (like file size limit exceeded)
                return res.status(400).json({
                    error: 'Multer error occurred during file upload.',
                    details: err.message,
                });
            } else if (err) {
                // GENERIC ERRORS (like invalid file types)
                return res.status(400).json({
                    error: 'File upload failed.',
                    details: err.message
                });
            }
            // FILE UPLOAD WAS SUCCESSFUL, CONTINUE TO THE NEXT MIDDLEWARE
            next();
        });
    };
};