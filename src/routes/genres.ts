import auth from '../middleware/auth';
import admin from '../middleware/admin';
import validateObjectId from '../middleware/validateObjectId';
import { getGenres, storeGenres, updateGenre, deleteGenre, getGenre } from '../controllers/genres';
import * as express from 'express';
import { UploadFile } from '../utils/UploadFile.util';
const router = express.Router();

router.route('/')
  .get(getGenres)
  .post([auth, UploadFile("genres", "image", 1)], storeGenres);

router.route('/:id')
  .put([UploadFile("genres", "image", 1)], updateGenre)
  .delete([auth, admin], deleteGenre)
  .get(validateObjectId, getGenre);

export default router;