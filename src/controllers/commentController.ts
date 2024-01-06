import { Request, Response } from 'express';
import { Model } from 'sequelize'; 
import { Book, User, Comment } from '../database';



// Interfaces for Sequelize models
interface BookInstance extends Model {
    id: number;
    title: string;
    isbn: string;
    year?: number| null;
    author?: string| null;
    pages?: number| null;
    publisherId: number;
    publisher?: PublisherInstance;
    comments?: CommentInstance[];
  }
  
  interface PublisherInstance extends Model {
    id: number;
    name: string;
    country?: string | null;
    books?: BookInstance[];
  }
  
  interface CommentInstance extends Model {
    id: number;
    name: string;
    comment: string;
    stars?: number| null;
    bookId: number;
    book?: BookInstance;
  }

 
  interface IUser extends Model {
    id: number;
    email: string;
    password: string;
}


class CommentController {

    // Method to create a new comment
    async createComment(req: Request, res: Response) {
      try {
          // Using type assertion to bypass TypeScript's type checking
          const user = (req as any).user as IUser;
  
          const { comment, bookId, stars, name } = req.body; // Include 'name' here
  
          // Verify required fields and that the user is authenticated
          if (!comment || !bookId || !user.id || !name) { // Check for 'name' as well
              return res.status(400).json({ error: 'Missing required fields or user is not authenticated' });
          }
  
          // Check if the associated book exists
          const bookExists = await Book.findByPk(bookId);
          if (!bookExists) {
              return res.status(404).json({ error: 'Book not found' });
          }
  
          // Create a new comment with the user ID and name
          const newComment = await Comment.create({ 
              name,       // Include 'name' in the creation
              comment, 
              bookId, 
              stars, 
              userId: user.id // Use the authenticated user's ID
          });
  
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
  