import auth from '../controllers/auth';
import * as express from 'express';
const router = express.Router();

router.post('/', auth);

export default router;