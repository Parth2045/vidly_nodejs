import { getMovies, storeMovie, updateMovie, deleteMovie, getMovie } from '../controllers/movies';
import * as express from 'express';
import { UploadFile } from '../utils/UploadFile.util';
const router = express.Router();

router.route('/')
  .get(getMovies)
  .post([UploadFile("movies", "image", 1)], storeMovie);

router.route('/:id')
  .put([UploadFile("movies", "image", 1)], updateMovie)
  .delete(deleteMovie)
  .get(getMovie);

export default router;