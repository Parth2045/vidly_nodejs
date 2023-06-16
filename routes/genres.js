import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import validateObjectId from '../middleware/validateObjectId.js';
import * as genresController from '../controllers/genres.js';
import * as express from 'express';
const router = express.Router();

router.route('/')
  .get(genresController.getGenres)
  .post(auth, genresController.storeGenres);

router.route('/:id')
  .put(genresController.updateGenre)
  .delete([auth, admin], genresController.deleteGenre)
  .get(validateObjectId, genresController.getGenre);

export default router;