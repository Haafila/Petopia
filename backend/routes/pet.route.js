import express from 'express';
import authMiddleware from '../middleware/auth.middleware';
import { getUserPets, addPet, getPet, updatePet, deletePet, uploadPet } from '../controllers/pet.controller';

const router = express.Router();

// All pet routes require login
router.get('/', authMiddleware, getUserPets);
router.post('/add', authMiddleware, uploadPet.single('image'), addPet);
router.get('/:id', authMiddleware, getPet);
router.put('/:id', authMiddleware, uploadPet.single('image'), updatePet);
router.delete('/:id', authMiddleware, deletePet);

export default router;