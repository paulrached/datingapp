// Model: The model represents the data and the database interactions. In your code, the interaction with the MySQL database can be considered part of the model. You can create a separate file, let's say database.js, to handle the database connection and queries.
import mysql from 'mysql';
import multer from'multer';
import path from 'path';

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "datingapp"
});

//this section to save the image in our project 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder where the file will be saved
    cb(null, path.join('./public', 'images'));
  },
  filename: function (req, file, cb) {
    // Set the filename to be unique by appending a timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
// Create a multer instance with the storage configuration
export const upload = multer({ storage: storage }).single('picture');

// this section to reset password 
// function findUserByEmail(email) {
//   // Example implementation
//   const users = [
//     { email: 'user1@example.com', password: 'password1' },
//     { email: 'user2@example.com', password: 'password2' },
//   ];
//   return users.find((user) => user.email === email);
// }

// function updateUserPassword(email, newPassword) {
//   // Example implementation
//   const user = findUserByEmail(email);
//   if (user) {
//     user.password = newPassword;
//   }
// }
// module.exports = { findUserByEmail, updateUserPassword };


export default con;