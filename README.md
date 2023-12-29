# Hala Zraiq Library App

Welcome to the Hala Zraiq Library App! This application is built using TypeScript, Express.js, and Sequelize for managing books, publishers, and comments in a library.

## Table of Contents

- [Database Schema](#database-schema)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Database Schema

The database schema is designed using draw.io. You can view and download the schema by clicking (<https://drive.google.com/file/d/13UTDOW8SKk6IoKm-m8z8UgEZAi05iEa7/view?usp=sharing>).

## Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/SD-1023/Hala-Zraiq-Library-App.git
   cd Hala-Zraiq-Library-App
Install Dependencies:
npm install

2.Set Up the Database:

Configure your database connection in the src/database.ts file.
Run Sequelize migrations to create the database tables:
npx sequelize-cli db:migrate
3.Run the Application:
npm start
------------------------------------------------------------------


# API Endpoints

# Books
Create a new book:

POST: /books
Required fields: title, isbn, publisher_id
Optional fields: year, author, pages
Publisher_id should be the ID of an existing publisher
ISBN should be unique
Get a book by ID:
----------------------------------------------------------------------------
GET: /books/:id
Returns book information, publisher details, and comments.
Example response:
json
{
  "book": {},
  "publisher": {},
  "comments": []
}
-------------------------------------------------------
Get all books:
GET: /books
-------------------------------------------------------
Update a book:
PUT: /books/:id.
--------------------------------------------------------
Delete a book:
DELETE: /books/:id
Deletes associated comments as well.
----------------------------------------------------------

Publishers

Create a new publisher:
POST: /publishers
Required fields: name
Optional fields: country
------------------------------------------------------------
Get all publishers:
GET: /publishers
-------------------------------------------------------------
Get a publisher by ID:
GET: /publisher/:id
------------------------------------------------------------
Delete a publisher:
DELETE: /publisher/:id
Does not delete the publisher if it has any published books.
------------------------------------------------------------
Get books by a publisher:
GET: /publisher/:id/books
------------------------------------------------------------
Comments
Create a new comment on a book:
POST: /comments
Required fields: name, comment, book_id
Optional fields: stars
Book_id should be the ID of an existing book.
------------------------------------------------------------
Delete a comment:
DELETE: /comments/:id
------------------------------------------------------------
Top Rated Books
Get top-rated books:
GET: /books/top-rated
Returns the top 10 books sorted by average stars. Comments without stars are ignored.
---------------------------------------------------------------
# Usage
The application uses Sequelize to interact with the database.
Endpoints can be tested using tools like Postman or by integrating with a front-end application.

# Contributing
Feel free to contribute to the project by opening issues or pull requests.

# License
This project is licensed under the MIT License.




