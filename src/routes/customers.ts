import { getCustomers, storeCustomer, updateCustomer, deleteCustomer, getCustomer } from '../controllers/customers';
import * as express from 'express';
const router = express.Router();

router.route('/')
  .get(getCustomers)
  .post(storeCustomer);

router.route('/:id')
  .put(updateCustomer)
  .delete(deleteCustomer)
  .get(getCustomer);

export default router;