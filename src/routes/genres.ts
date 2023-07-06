import auth from '../middleware/auth';
import admin from '../middleware/admin';
import validateObjectId from '../middleware/validateObjectId';
import * as genresController from '../controllers/genres';
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