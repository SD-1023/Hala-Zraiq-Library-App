import express from 'express';
import BookController from '../controllers/bookController';

const bookRoutes = express.Router();




bookRoutes.post('/', BookController.createBook);
bookRoutes.get('/top-rated', BookController.getTopRatedBooks); 
bookRoutes.get('/', BookController.getAllBooks);
bookRoutes.put('/:id', BookController.updateBook);
bookRoutes.get('/:id', BookController.getBookById);             
bookRoutes.delete('/:id', BookController.deleteBook);





export default bookRoutes;
