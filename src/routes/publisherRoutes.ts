import express from 'express';
import PublisherController from '../controllers/publisherController';

const publisherRoutes = express.Router();


publisherRoutes.post('/', PublisherController.createPublisher);
publisherRoutes.get('/', PublisherController.getAllPublishers);
publisherRoutes.get('/:id', PublisherController.getPublisherById);
publisherRoutes.delete('/:id', PublisherController.deletePublisher);
publisherRoutes.get('/:id/books', PublisherController.getBooksByPublisher);




export default publisherRoutes;
