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
Object.defineProperty(exports, "__esModule", { value: true });
const movies_1 = require("../controllers/movies");
const express = __importStar(require("express"));
const UploadFile_util_1 = require("../utils/UploadFile.util");
const router = express.Router();
router.route('/')
    .get(movies_1.getMovies)
    .post([(0, UploadFile_util_1.UploadFile)("movies", "image", 1)], movies_1.storeMovie);
router.route('/:id')
    .put([(0, UploadFile_util_1.UploadFile)("movies", "image", 1)], movies_1.updateMovie)
    .delete(movies_1.deleteMovie)
    .get(movies_1.getMovie);
exports.default = router;
