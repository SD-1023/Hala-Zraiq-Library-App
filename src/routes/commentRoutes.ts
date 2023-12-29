import express from 'express';
import commentController from '../controllers/commentController';
const commentRoutes = express.Router();



commentRoutes.post('/', commentController.createComment);
commentRoutes.delete('/:id', commentController.deleteComment);





export default commentRoutes;
