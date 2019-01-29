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
    db.getPortpholio(req.query.id, (err, response) => {
        if (err) {
            res.status(501).send();
        } else {
            res.end(JSON.stringify(response));
        }
    });
});

app.post('/buy', (req, res) => {
    console.log('post');
    console.log(req.body);
    db.BuyStock(req.body.id, req.body.symbol, req.body.price, req.body.number, (err, response) => {
        if (err) {
            res.status(501).send();
        } else {
            res.send('Created.');
        }
    });
});

app.post('/sell', (req, res) => {
    console.log('sell');
    db.SellStock(req.body._id, (err, response) => {
        if (err) {
            res.status(501).send();
        } else {
            res.send('Updated.');
        }
    });
});

app.get('/*', function (req, res) {
    res.redirect('/');
})

app.listen(PORT, () => {
    console.log(`server listening on port, ${PORT}`);
});