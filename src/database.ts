import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('books', 'root', '09877890a', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define models 
const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    isbn: {
        type: new DataTypes.STRING(13),
        allowNull: false,
        unique: true,
    },
    year: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    author: {
        type: new DataTypes.STRING(128),
        allowNull: true,
    },
    pages: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    publisherId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    }
}, {
    tableName: 'books',
    timestamps :false

});

const Publisher = sequelize .define ("Publisher",{
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    country: {
        type: new DataTypes.STRING(128),
        allowNull: true,
    }
}, {
    tableName: 'publishers',
    timestamps :false

  
});

const Comment  = sequelize .define ("comment",{
    
    id: {
         type: DataTypes.INTEGER.UNSIGNED,
         autoIncrement: true,
         primaryKey: true,
     },
     name: {
         type: new DataTypes.STRING(128),
         allowNull: false,
     },
     comment: {
         type: new DataTypes.TEXT(),
         allowNull: false,
     },
     stars: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: true,
     },
     bookId: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
     }
 }, {
     tableName: 'comments',
     timestamps :false

 });







// Define associations
Publisher.hasMany(Book, { foreignKey: 'publisherId', as: 'books' });
Comment.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });
Book.belongsTo(Publisher, { foreignKey: 'publisherId', as: 'publisher' });
Book.hasMany(Comment, { foreignKey: 'bookId', as: 'comments' });







// Authenticate and export
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export { sequelize, Book, Publisher, Comment };
