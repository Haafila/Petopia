import express from 'express';
import { register, login, verify } from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', authMiddleware, verify);

export default router;