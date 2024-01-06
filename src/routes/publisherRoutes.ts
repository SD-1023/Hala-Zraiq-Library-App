import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';

import PublisherController from '../controllers/publisherController';

const publisherRoutes = express.Router();


publisherRoutes.post('/',authenticateUser, PublisherController.createPublisher);
publisherRoutes.get('/', authenticateUser,PublisherController.getAllPublishers);
publisherRoutes.get('/:id', authenticateUser,PublisherController.getPublisherById);
publisherRoutes.delete('/:id', authenticateUser,PublisherController.deletePublisher);
publisherRoutes.get('/:id/books', authenticateUser,PublisherController.getBooksByPublisher);




export default publisherRoutes;
