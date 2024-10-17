"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../startup/config");
// IMAGE TYPES
const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg'];
const getUploadFileTypes = (uploadFileType) => {
    if (uploadFileType === 1) {
        return imageTypes;
    }
    return [];
};
const UploadFile = (folderPath, param, uploadFileType) => {
    // SET UP MULTER STORAGE
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, config_1.pulicFolder + "/" + folderPath);
        },
        filename: (req, file, cb) => {
            cb(null, path_1.default.basename(file.originalname, path_1.default.extname(file.originalname)) + '-' + Date.now() + path_1.default.extname(file.originalname));
        }
    });
    // FILE TYPE VALIDATION
    const fileFilter = (req, file, cb) => {
        const allowedTypes = getUploadFileTypes(uploadFileType);
        // CHECK IF THE UPLOADED FILE'S MIME TYPE MATCHES THE ALLOWED TYPES
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // ACCEPT THE FILE
        }
        else {
            cb(new Error(`Invalid file type. Allowed types: ${JSON.stringify(allowedTypes)}`), false); // REJECT THE FILE
        }
    };
    const upload = (0, multer_1.default)({
        storage: storage,
        fileFilter: fileFilter,
        // limits: {
        //     fileSize: 1024 * 1024 * 1 // 1MB (ADJUST AS NEEDED)
        // },
    });
    // RETURN MIDDLEWARE FUNCTION
    return (req, res, next) => {
        // EXECUTE UPLOAD AND HANDLE ERRORS
        upload.single(param)(req, res, (err) => {
            if (err instanceof multer_1.default.MulterError) {
                // MULTER-SPECIFIC ERRORS (like file size limit exceeded)
                return res.status(400).json({
                    error: 'Multer error occurred during file upload.',
                    details: err.message,
                });
            }
            else if (err) {
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
exports.UploadFile = UploadFile;
