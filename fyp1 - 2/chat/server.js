const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql');
const ejs = require('ejs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3001;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'datingapp'
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});
const path = require('path');

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));




// Serve the index.html file and pass the usernames as query parameters
app.get('/chat.html', (req, res) => {
  const currentUser = req.query.currentUser;
  const otherUser = req.query.otherUser;
  res.render('index.ejs', { currentUser: currentUser, otherUser: otherUser });
});

// Handle new socket connections
io.on('connection', (socket) => {
  // Prompt the user for their username and the other user's username
  socket.on('join chat', (data) => {
    const { currentUser, otherUser } = data;
    socket.join(currentUser); // Join a room specific to the current user

    // Fetch previous messages between the specified users from the database
    const query = `SELECT * FROM messages WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY created_at`;
    connection.query(query, [currentUser, otherUser, otherUser, currentUser], (err, results) => {
      if (err) {
        console.error('Error fetching messages from MySQL:', err);
        return;
      }
      // Send the previous messages to the newly connected socket
      socket.emit('previous messages', results);
    });
  });

  // Handle new chat messages
  socket.on('chat message', (data) => {
    const { currentUser, otherUser, message } = data;
    // Save the message in the database
    const query = 'INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)';
    connection.query(query, [currentUser, otherUser, message], (err, result) => {
      if (err) {
        console.error('Error saving message to MySQL:', err);
        return;
      }
      // Broadcast the message to all connected sockets in the specific room
      io.to(currentUser).emit('chat message', { id: result.insertId, sender: currentUser, receiver: otherUser, message: message });
      io.to(otherUser).emit('chat message', { id: result.insertId, sender: currentUser, receiver: otherUser, message: message });
    });
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
