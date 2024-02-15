const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/notes.html');
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuidv4();
        notes.push(newNote);
        fs.writeFile('db.json', JSON.stringify(notes, null, 2), (err) => {
            if (err) throw err;
            res.json(newNote);
        });
    });
});

// Delete note
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        const filteredNotes = notes.filter(note => note.id !== req.params.id);
        fs.writeFile('db.json', JSON.stringify(filteredNotes, null, 2), (err) => {
            if (err) throw err;
            res.sendStatus(200);
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});

