//Adding ncessary import
const express = require('express');
const path = require('path');
let jsonfile = require('./db/db.json');
const fs = require('fs');
const PORT = 3002;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

//Fetching default page
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//fetching notes.html after clicking on the start button
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET request for notes api data
app.get('/api/notes', (req, res) => {
    // fetching the notes json data
    res.json(jsonfile);
});

app.delete('/api/notes/:id', (req, res) => {
    jsonfile = jsonfile.filter(note => req.params.id!=note.id)
    
    fs.writeFile('./db/db.json', JSON.stringify(jsonfile), 'utf8', () => {
        return res.json(jsonfile);
    }); // write it back 
})

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a review`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newReview = {
            title,
            text,
            id: uuid(),
        };

        fs.readFile('./db/db.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                data = JSON.parse(data); //now it an object
                data.push(newReview); //add some data
                // json = JSON.stringify(data); //convert it back to json
                fs.writeFile('./db/db.json', JSON.stringify(data), 'utf8', () => {
                    return res.json(data);
                }); // write it back 
            }
        });
        // const response = {
        //     status: 'success',
        //     body: newReview,
        // };

        // console.log(response);
        // res.json(response);
    } else {
        res.json('Error in posting review');
    }

});
//   noteList = document.querySelectorAll('.list-container .list-group');

//listen to the given port
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);

    // router.delete("/notes/:id", function(req, res){
    //     notes.removeNote(req.params.id)

    //     .then(notes => notes.filter(note => note.id !== parseInt(id)))
    //     .then(updatedNotes => this.write(updatedNotes))

    //     .then(() => res.json({ok: true}))
    //     .catch(err => res.status(500).json(err));
    // })
    // removeNote(id) {
    //     console.log("remove notes");
    //     return this.getNotes()
    //         .then(notes => notes.filter(note => note.id !== parseInt(id)))
    //         .then(updatedNotes => this.write(updatedNotes))
    // }