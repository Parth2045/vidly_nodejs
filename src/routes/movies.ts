import * as moviesController from '../controllers/movies';
import * as express from 'express';
const router = express.Router();

router.route('/')
  .get(moviesController.getMovies)
  .post(moviesController.storeMovie);

router.route('/:id')
  .put(moviesController.updateMovie)
  .delete(moviesController.deleteMovie)
  .get(moviesController.getMovie);

export default router;