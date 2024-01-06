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
        defaultValue: null,
    },
    author: {
        type: new DataTypes.STRING(128),
        allowNull: true,
        defaultValue: null,

    },
    pages: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
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
        defaultValue: null,
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
            type: DataTypes.INTEGER,
            allowNull: true, // Allow the field to be nullable
            defaultValue: null, // Set a default value as null
        },
          
     
     bookId: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
     }
 }, {
     tableName: 'comments',
     timestamps :false

 });

 const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
  }, {
    tableName: 'users',
    timestamps: true,
  });
  
  const Session = sequelize.define('sessions', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    token: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'sessions',
    timestamps: true,
  });
  

// Define associations
Publisher.hasMany(Book, { foreignKey: 'publisherId', as: 'books' });
Comment.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });
Book.belongsTo(Publisher, { foreignKey: 'publisherId', as: 'publisher' });
Book.hasMany(Comment, { foreignKey: 'bookId', as: 'comments' });
User.hasMany(Session, { foreignKey: 'userId', onDelete: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Book, { foreignKey: 'userId', onDelete: 'CASCADE' });
Book.belongsTo(User, { foreignKey: 'userId' });







// Authenticate and export
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export { sequelize, Book, Publisher, Comment ,User,Session};
