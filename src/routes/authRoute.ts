import express from 'express';
import { signup, signin, changePassword } from '../controllers/authController'
import { authenticateUser } from '../middleware/authMiddleware';

const authRoutes = express.Router();

authRoutes.post('/signup', signup);
authRoutes.post('/signin', signin);
authRoutes.post('/changePassword',authenticateUser, changePassword);

export default authRoutes;
