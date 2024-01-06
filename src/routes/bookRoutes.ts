import express from 'express';
import BookController from '../controllers/bookController';
import { authenticateUser } from '../middleware/authMiddleware';


const bookRoutes = express.Router();




bookRoutes.post('/', authenticateUser,BookController.createBook);
bookRoutes.get('/top-rated', authenticateUser,BookController.getTopRatedBooks); 
bookRoutes.get('/', BookController.getAllBooks);
bookRoutes.put('/:id', authenticateUser,BookController.updateBook);
bookRoutes.get('/:id', authenticateUser,BookController.getBookById);             
bookRoutes.delete('/:id', authenticateUser,BookController.deleteBook);





export default bookRoutes;
