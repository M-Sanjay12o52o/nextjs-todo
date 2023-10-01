// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

// Create an instance of the Express application
const app = express();

// Set the port the server will listen on
const PORT = 3001;

// MongoDB connection details
const MONGO_URL = 'mongodb://localhost:27017';
const DATABASE_NAME = 'todoApp';
const TODOS_COLLECTION = 'todos';

let db;  // Database instance

// Function to initialize the database connection
const initializeDatabase = () => {
  return MongoClient.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
      db = client.db(DATABASE_NAME);
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    });
};

// Function to get the database instance
const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
};

// Use middleware to parse JSON requests
app.use(bodyParser.json());

// Endpoint to handle POST requests to add todos
app.post('/todos', (req, res) => {
  try {
    const { userId, todo } = req.body;
    const todosCollection = getDb().collection(TODOS_COLLECTION);

    // Update or insert a todo for a specific user based on userId
todosCollection.updateOne(
  { userId: userId },  // Filter: Look for a document with this userId
  { $push: { todos: todo } },  // Update operation: Push the new todo into the 'todos' array
  { upsert: true }  // Upsert option: Perform an upsert if no document matches the filter
);


    res.status(201).send('Todo added successfully.');
  } catch (error) {
    res.status(500).send('Error adding todo: ' + error.message);
  }
});

// Endpoint to handle GET requests to retrieve todos for a specific user
app.get('/todos/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    const todosCollection = getDb().collection(TODOS_COLLECTION);

    todosCollection.findOne({ userId: userId })
      .then((result) => {
        if (result) {
          res.json(result.todos);
        } else {
          res.json([]);
        }
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    res.status(500).send('Error retrieving todos: ' + error.message);
  }
});

// Initialize the database and start the server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database. Server not started.', error);
  });
