import * as usersController from '../controllers/users';
import auth from '../middleware/auth';
import * as express from 'express';
const router = express.Router();

router.get('/me', auth, usersController.getCurrentUser);
router.post('/', usersController.createUser);

export default router;