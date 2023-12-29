import { Request, Response } from 'express';
import { sequelize } from '../database';
import { Book, Publisher, Comment } from '../database'; 
import { Model} from 'sequelize'; 
import Sequelize from 'sequelize'; 


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




class BookController {

  // Method to create a new book
  async createBook(req: Request, res: Response) {
    try {
      const { title, isbn, publisherId, year, author, pages } = req.body;

      // Verify required fields
      if (!title || !isbn || !publisherId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Verify if publisher exists
      const publisher = await Publisher.findByPk(publisherId);
      if (!publisher) {
        return res.status(400).json({ error: 'Invalid publisher ID' });
      }

      // Verify unique ISBN
      const existingBook = await Book.findOne({ where: { isbn } });
      if (existingBook) {
        return res.status(400).json({ error: 'ISBN already exists' });
      }

      // Create book
      const newBook = await Book.create({ title, isbn, publisherId, year, author, pages });
      res.status(201).json(newBook);
    } catch (error: any) {

      // Check if error is related to data length
      if (error.original && error.original.code === 'ER_DATA_TOO_LONG') {
        return res.status(400).json({ error: `Data too long for column. Please check your inputs.` });
      }
      // Log the error and send a generic error response
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  
  }



// Method to get a book by ID with associated publisher and comments
/*SELECT *
FROM Book
LEFT JOIN Comment ON Book.id = Comment.bookId
WHERE Book.id = 'specifiedBookId';*/
 async getBookById(req: Request, res: Response) {
    try {
      const bookId = req.params.id;
      const book = await Book.findByPk(bookId, {
        include: [
          { model: Publisher, as: 'publisher' },
          { model: Comment, as: 'comments' },
        ],
      }) as BookInstance; // Type casting here

      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }



 // Method to get all books
// SELECT * FROM Book;


  async getAllBooks(req: Request, res: Response) {
    try {
      const books = await Book.findAll();
       // Respond with an array of books in JSON format
      res.json(books);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }





// Method to update a book
  /*UPDATE Book
  SET title = 'newTitle', isbn = 'newISBN', publisherId = 'newPublisherID', year = 'newYear', author = 'newAuthor', pages = 'newPages'
   WHERE id = 'BookID';
   */

  async updateBook(req: Request, res: Response) {
    try {
      const bookId = req.params.id;
      // Extract updated book information from request body
      const { title, isbn, publisherId, year, author, pages } = req.body;

      const book = await Book.findByPk(bookId);

      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      // Check if the new publisherId exists
      const publisher = await Publisher.findByPk(publisherId);
      if (!publisher) {
        return res.status(400).json({ error: 'New publisher not found' });
      }
      // Update the book with the new information
      await book.update({ title, isbn, publisherId, year, author, pages });

      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }






  // Method to delete a book and its associated comments
 /// DELETE FROM Comment WHERE bookId = 'specifiedBookID';

  //DELETE FROM Book WHERE id = 'specifiedBookID';

  async deleteBook(req: Request, res: Response) {
    try {
      const bookId = req.params.id;
      const book = await Book.findByPk(bookId);

      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      // Delete associated comments
      await Comment.destroy({ where: { bookId } });

      // Delete the book
      await book.destroy();

      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }



  
  // Method to get the top-rated books based on average stars
  async getTopRatedBooks(req:Request, res:Response) {
    try {
      const query = `
          SELECT b.id, b.title, b.isbn, b.year, b.author, b.pages, b.publisherId, 
                 p.id AS 'publisher.id', p.name AS 'publisher.name', p.country AS 'publisher.country', 
                 AVG(c.stars) AS avgStars
          FROM books b
          LEFT JOIN publishers p ON b.publisherId = p.id
          LEFT JOIN comments c ON b.id = c.bookId
          WHERE c.stars IS NOT NULL
          GROUP BY b.id, p.id
          ORDER BY avgStars DESC
          LIMIT 10
      `;

      const topRatedBooks = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });

      res.json(topRatedBooks);
  } catch (error) {
      console.error('Error fetching top rated books:', error);
      throw error;
  }
};
} 



export default new BookController();
