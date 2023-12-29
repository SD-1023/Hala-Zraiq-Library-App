import { Request, Response } from 'express';
import { Model } from 'sequelize'; 
import { Book, Publisher, Comment } from '../database';



// Interfaces for Sequelize models
interface BookInstance extends Model {
    id: number;
    title: string;
    isbn: string;
    year?: number;
    author?: string;
    pages?: number;
    publisherId: number;
    publisher?: PublisherInstance;
    comments?: CommentInstance[];
  }
  
  interface PublisherInstance extends Model {
    id: number;
    name: string;
    country?: string;
    books?: BookInstance[];
  }
  
  interface CommentInstance extends Model {
    id: number;
    name: string;
    comment: string;
    stars?: number;
    bookId: number;
    book?: BookInstance;
  }




  class PublisherController {

    // Method to create a new publisher
    async createPublisher(req: Request, res: Response) {
      const { name, country } = req.body;

      // Validate required fields
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
  
      try {
        // Create a new publisher
        const newPublisher = await Publisher.create({ name, country });
        res.status(201).json(newPublisher);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }


   // Method to get all publishers
    async getAllPublishers(req: Request, res: Response) {
        try {
          // Retrieve all publishers
          const publishers = await Publisher.findAll();
          res.json(publishers);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }



     // Method to get a publisher by ID
    async getPublisherById(req: Request, res: Response) {
        try {
          const publisherId = req.params.id;
          // Find and return the publisher by ID
          const publisher = await Publisher.findByPk(publisherId);
    
          if (!publisher) {
            return res.status(404).json({ error: 'Publisher not found' });
          }
    
          res.json(publisher);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }




  // Method to delete a publisher (if no books are associated)
    async deletePublisher(req: Request, res: Response) {
        try {
          const publisherId = req.params.id;
    
          // Check if the publisher has any books published
          const books = await Book.findAll({ where: { publisherId } });
          if (books.length > 0) {
            return res.status(400).json({ error: 'Cannot delete publisher with published books' });
          }

          // Delete the publisher
          const result = await Publisher.destroy({ where: { id: publisherId } });
    
          if (result === 0) {
            return res.status(404).json({ error: 'Publisher not found' });
          }
    
          res.json({ message: 'Publisher deleted successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }


   // Method to get all books by a specific publisher
   //full joine 
    async getBooksByPublisher(req: Request, res: Response) {
        try {
            const publisherId = req.params.id;
            
            // Cast the instance to the PublisherInstance type
            const publisher = await Publisher.findByPk(publisherId) as PublisherInstance | null;
            if (!publisher) {
                return res.status(404).json({ error: 'Publisher not found' });
            }
      
            // Get all books by this publisher
            const books = await Book.findAll({ 
                where: { publisherId: publisher.id } // TypeScript now knows about 'id'
            });
      
            res.json(books);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }  
    
  }
    export default new PublisherController();


      
    




























  
  
  