import * as customersController from '../controllers/customers';
import * as express from 'express';
const router = express.Router();

router.route('/')
  .get(customersController.getCustomers)
  .post(customersController.storeCustomer);

router.route('/:id')
  .put(customersController.updateCustomer)
  .delete(customersController.deleteCustomer)
  .get(customersController.getCustomer);

export default router;