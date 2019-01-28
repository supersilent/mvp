const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;
const db = require('./db');

app.use(express.static('./dist/client'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/info/', (req, res) => {
    db.getPortpholioById(req.query.id, (err, response) => {
        if (err) {
            res.status(501).send();
        } else {
            res.end(JSON.stringify(response));
        }
    });
});

app.get('/*', function (req, res) {
    res.redirect('/');
})

app.post('/buy', (req, res) => {
    db.insertPhotos(req.params.id, req.query.photo_id, req.query.url, req.query.caption, (err, response) => {
        if (err) {
            res.status(501).send();
        } else {
            res.end(JSON.stringify(response));
        }
    });
});

app.listen(PORT, () => {
    console.log(`server listening on port, ${PORT}`);
});