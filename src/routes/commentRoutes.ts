import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';

import commentController from '../controllers/commentController';
const commentRoutes = express.Router();




commentRoutes.post('/', authenticateUser,commentController.createComment);
commentRoutes.delete('/:id', authenticateUser,commentController.deleteComment);





export default commentRoutes;
