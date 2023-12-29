import bookRoutes from './routes/bookRoutes';
import {sequelize} from './database';
import publisherRoutes from './routes/publisherRoutes';
import commentRoutes from './routes/commentRoutes';
const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());


sequelize.authenticate().then(() => {
  console.log('Connection to the database has been established successfully.');
}).catch((error: any) => {
  console.error('Unable to connect to the database:', error);
});


app.use('/books', bookRoutes);
app.use('/publishers', publisherRoutes);
app.use('/comments', commentRoutes);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});







 