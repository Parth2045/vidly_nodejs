import * as usersController from '../controllers/users.js';
import auth from '../middleware/auth.js';
import * as express from 'express';
const router = express.Router();

router.get('/me', auth, usersController.getCurrentUser);
router.post('/', usersController.createUser);

export default router;