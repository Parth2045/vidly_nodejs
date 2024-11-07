import { getCustomers, storeCustomer, updateCustomer, deleteCustomer, getCustomer, signIn } from '../controllers/customers';
import * as express from 'express';
const router = express.Router();

router.route('/')
  .get(getCustomers)
  .post(storeCustomer);

router.route('/:id')
  .put(updateCustomer)
  .delete(deleteCustomer)
  .get(getCustomer);

router.route('/signin')
  .post(signIn);

export default router;