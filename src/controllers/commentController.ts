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


class CommentController {

    // Method to create a new comment
    async createComment(req: Request, res: Response) {
      const { name, comment, bookId, stars } = req.body;

        // Verify required fields
        if (!name || !comment || !bookId) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
        try {
          // Check if the associated book exists
          const bookExists = await Book.findByPk(bookId);
          if (!bookExists) {
            return res.status(404).json({ error: 'Book not found' });
          }
    
          // Create a new comment
          const newComment = await Comment.create({ name, comment, bookId, stars }) as CommentInstance;
    
          res.status(201).json(newComment);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }


  // Method to delete a comment 
    async deleteComment(req: Request, res: Response) {
      try {
        const commentId = req.params.id;
        const result = await Comment.destroy({ where: { id: commentId } });
        
        // Check if the comment was found and deleted
        if (result === 0) {
          return res.status(404).json({ error: 'Comment not found' });
        }
  
        res.json({ message: 'Comment deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
  
  export default new CommentController();
  