"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../middleware/auth"));
const admin_1 = __importDefault(require("../middleware/admin"));
const validateObjectId_1 = __importDefault(require("../middleware/validateObjectId"));
const genres_1 = require("../controllers/genres");
const express = __importStar(require("express"));
const UploadFile_util_1 = require("../utils/UploadFile.util");
const router = express.Router();
router.route('/')
    .get(genres_1.getGenres)
    .post([auth_1.default, (0, UploadFile_util_1.UploadFile)("genres", "image", 1)], genres_1.storeGenres);
router.route('/:id')
    .put([(0, UploadFile_util_1.UploadFile)("genres", "image", 1)], genres_1.updateGenre)
    .delete([auth_1.default, admin_1.default], genres_1.deleteGenre)
    .get(validateObjectId_1.default, genres_1.getGenre);
exports.default = router;
