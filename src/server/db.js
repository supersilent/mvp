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
    cash: Number,
    stocks: [{
        symbol: String,
        price: Number,
        number: Number,
        date: Date,
        isSold: Number
    }]
});

const Portpholio = mongoose.model('Portpholio', portpholioSchema);

const getPortpholio = (id, callback) => {
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
    }, {
        $push: {
            stocks: {
                number,
                symbol,
                price,
                date: Date(),
                isSold: false
            }
        }

    }, (err, entry) => {
        console.log('entry', entry)
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, entry);
        }
    })
};

// BuyStock('shota', 'AMD', 100, 10, Date(), () => {});


const SellStock = (_id, callback) => {
    Portpholio.updateOne({
        "stocks._id": _id,
        "stocks._id": _id
    }, {
        $set: {
            "stocks.$.isSold": true
        }
    }, {
        upsert: true
    }, (err, entry) => {
        console.log('entry', entry)
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, entry);
        }
    })
};

// SellStock("5c4fd510940c7ac4ff48f673", () => {});

module.exports = {
    getPortpholio,
    BuyStock,
    SellStock
};