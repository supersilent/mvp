const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/errbnb', {
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Connected To Mongo Database');
})

const portpholioSchema = mongoose.Schema({
    id: String,
    password: String,
    stocks: [{
        symbol: String,
        price: Number,
        number: Number
    }]
});

const Portpholio = mongoose.model('Portpholio', portpholioSchema);

const getPortpholioById = (id, callback) => {
    Portpholio.findOne({
        id
    }, (err, entry) => {
        console.log('entry', entry)
        if (!entry) {
            let newPort = new Portpholio({
                id
            })
            newPort.save(function (err) {
                if (err) return handleError(err);
            });
        }

        if (err) {
            callback(err, null);
        } else {
            callback(null, entry);
        }
    })
};

const BuyStock = (id, symbol, price, number, callback) => {
    Portpholio.findOneAndUpdate({
        id
    }, {}, (err, entry) => {
        console.log('entry', entry)
        if (!entry) {
            let newPort = new Portpholio({
                id
            })
            newPort.save(function (err) {
                if (err) return handleError(err);
            });
        }

        if (err) {
            callback(err, null);
        } else {
            callback(null, entry);
        }
    })
};

module.exports = {
    getPortpholioById
};