var express = require('express');
var fs = require('fs');
var router = express.Router();
var body = require('body-parser');
var request = require('request');
var mongoose = require('mongoose'); //Adds mongoose as a usable dependency
var url = require('url');
mongoose.connect('mongodb://localhost/quoteBoardDB'); //Connects to a mongo database called "quoteBoardDB"


var QuoteSchema = mongoose.Schema({

    date: String,
    quote: String,
    users: String
});
//test
var Quotes = mongoose.model('Quotes', QuoteSchema); //Makes an object from that schema as a model

var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("CA4 Server Running");
    res.sendFile('index.html', { root: 'public' });
});

router.post('/quote', function(req, res) { // save and edit quotes
    console.log("Update Quote");
    Quotes.find(function(err, allQuotes) {
        if (err) return console.error(err);
        else {
            var quoteFound = false;
            for (var i = 0; i < allQuotes.length; i++) { // checks database for pre-existing quote and updates
                if (allQuotes[i]._id == req.body._id) { // checks database based on ID. 
                    allQuotes[i] = { date: req.body.date, quote: req.body.quote, users: req.body.users };
                    quoteFound = true;
                    Quotes.update({ _id: req.body._id }, allQuotes[i], function(err, post) { //
                        if (err) return console.error(err);
                        console.log(post);
                        res.sendStatus(200);
                    })
                }
            }
            if (!quoteFound) { // if not pre-existing, create new
                if (allQuotes.length == 0) {
                    var newQuote = new Quotes({ date: req.body.date, quote: req.body.quote, users: req.body.users });
                } else {
                    var newQuote = new Quotes({ date: req.body.date, quote: req.body.quote, users: req.body.users });
                }
                newQuote.save(function(err, post) { //[4]
                    if (err) return console.error(err);
                    console.log(post);
                    res.sendStatus(200);
                });
            }
        }
    })
});
router.delete('/quote', function(req, res) {
    Quotes.deleteOne({ _id: req.query.id }, function(err, post) {
        if (err) return console.error(err);
        res.sendStatus(200);
    })

})
router.get('/quote', function(req, res, next) { //get list of all quotes
    console.log("Get Quote");
    Quotes.find(function(err, allQuotes) {
        if (err) return console.error(err);
        else {
            res.status(200).json(allQuotes);
        }
    })

});

module.exports = router;