const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API routes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
  newNote.id = Date.now().toString();
  notes.push(newNote);
  fs.writeFileSync('db/db.json', JSON.stringify(notes));
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
  const noteId = req.params.id;
  const updatedNotes = notes.filter(note => note.id !== noteId);
  fs.writeFileSync('db/db.json', JSON.stringify(updatedNotes));
  res.json({ message: 'Note deleted' });
});

// HTML routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
