import express from 'express';
import authMiddleware from '../middleware/auth.middleware';
import { getUser, updateUser, changePassword, upload } from '../controllers/user.controller';

const router = express.Router();

// All user routes require login
router.get('/:id', authMiddleware, getUser);
router.put('/:id', authMiddleware, upload.single('image'), updateUser);
router.put('/:id/change-password', authMiddleware, changePassword);

export default router;