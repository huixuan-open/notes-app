// server.js


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pg = require('pg');


const app = express();
const port = process.env.PORT || 3000;


// Database configuration
const pool = new pg.Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: '5432'
});


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Serve frontend
app.use(express.static('public'));


// GET endpoint to fetch all existing notes
app.get('/api/notes', (req, res) => {
   console.log('Fetching all notes!')
   pool.query('SELECT * FROM notes', (err, result) => {
       if (err) {
           console.error('Error executing query', err);
           res.status(500).json({ error: 'Internal Server Error' });
           return;
       }
       res.json(result.rows);
   });
});


// POST endpoint to create a new note
app.post('/api/notes', (req, res) => {
   console.log('Creating new note!')
   const { title, content } = req.body;
   pool.query('INSERT INTO notes (title, content) VALUES ($1, $2)', [title, content], (err, result) => {
       if (err) {
           console.error('Error executing query', err);
           res.status(500).json({ error: 'Internal Server Error' });
           return;
       }
       res.status(201).json({ message: 'Note added successfully' });
   });
});

// DELETE endpoint to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    console.log(`Deleting note with ID ${noteId}`);
    pool.query('DELETE FROM notes WHERE id = $1 RETURNING *', [noteId], (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
 
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Note not found' });
        } else {
            res.json({ message: 'Note deleted successfully' });
        }
    });
 });

// Start server
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
const deleteNote = (id) => {
    fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log('Success:', data);
            // Refresh the entire page after successful deletion
            window.location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
            // Optionally, handle the error and update the UI accordingly
        });
};

