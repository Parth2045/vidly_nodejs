import * as rentalController from '../controllers/rentals';
import * as express from 'express';
const router = express.Router();

router.route('/')
  .get(rentalController.getRentals)
  .post(rentalController.storeRental);

router.get('/:id', rentalController.getRental);

export default router;