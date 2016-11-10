var express = require('express');
var fs = require('fs');
var router = express.Router();
var body = require('body-parser');
var request = require('request');
var mongoose = require('mongoose'); //Adds mongoose as a usable dependency

mongoose.connect('mongodb://localhost/calendarDB'); //Connects to a mongo database called "calendarDB"

var calendarSchema = mongoose.Schema({
    user: String,
    calendar: [{
        id: Number,
        name: String,
        days:[{ date: Number, dayOfWeek: String, events: [{name: String, time: String, location: String}] }]
    }]
});

var Calendar = mongoose.model('Calendar', calendarSchema); //Makes an object from that schema as a model

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

router.post('/calendar', function(req, res) {
    console.log("Update Calendar");
    Calendar.find(function(err,calendars) {
        if (err) return console.error(err);
        else {
            var calendarFound = false;
            for (var i = 0; i < calendars.length; i++) { // checks database for pre-existing calendar and updates
                if (calendars[i].user == req.query.q) {
                    calendars[i] = { user: req.query.q, calendar: req.body };
                    calendarFound = true;
                }
            }
            if(!calendarFound){                         // if not pre-existing, create new
                var newCalendar = new Calendar({ user: req.query.q, calendar: req.body });
                newCalendar.save(function(err, post) { //[4]
                    if (err) return console.error(err);
                    console.log(post);
                    res.sendStatus(200);
                });
            }
            else{
                clendars.save(function(err, post){
                    if (err) return console.error(err);
                    console.log(post);
                    res.sendStatus(200);
                })
            }
        }
    })
});

router.get('/names', function(req,res,next) {
    console.log("Get Names");
    Calendar.find(function(err,calendars) {
        if (err) return console.error(err);
        else {
            var names = [];
            for(var i = 0; i < calendars.length; i++){
                names.push(calendars[i].user);
            }
            res.status(200).json(names);
        }
    })
});


router.get('/calendar', function(req, res, next) {
    console.log("Get Calendar");
    Calendar.find(function(err,calendars) {
        if (err) return console.error(err);
        else {    
            var profile = {};
            var inDatabase = false;
            for (var i = 0; i < calendars.length; i++) { // checks database for pre existing calendar
                if (calendars[i].user == req.query.q) {
                    profile = calendars[i];
                    inDatabase = true;
                }
            }
            if (inDatabase == false) {
                var day = { date: 0, dayOfWeek: "", events: [] }
                var daysInEachMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                profile = {
                    user: req.query.q,
                    calendar: [
                        { id: 0, name: "January", days: [], },
                        { id: 1, name: "Febuary", days: [], },
                        { id: 2, name: "March", days: [], },
                        { id: 3, name: "April", days: [], },
                        { id: 4, name: "May", days: [], },
                        { id: 5, name: "June", days: [], },
                        { id: 6, name: "July", days: [], },
                        { id: 7, name: "August", days: [], },
                        { id: 8, name: "September", days: [], },
                        { id: 9, name: "October", days: [], },
                        { id: 10, name: "November", days: [], },
                        { id: 11, name: "December", days: [], }
                    ]
                };

                var currentDayOfWeek = 5; //2016 starts on a thursday...
                function calcDays() {
                    for (var i = 0; profile.calendar.length > i; i++) { //selects correct month
                        for (var j = 0; currentDayOfWeek > j; j++) {
                            profile.calendar[i].days.push({ date: null, dayOfWeek: j, events: [] });
                        }
                        for (var j = 1; daysInEachMonth[i] >= j; j++) {
                            profile.calendar[i].days.push({ date: j, dayOfWeek: currentDayOfWeek, events: [] });
                            if (currentDayOfWeek == 6) { // increments days of week
                                currentDayOfWeek = 0;
                            } else {
                                currentDayOfWeek += 1;
                            }
                        }
                    }
                };
                calcDays();
            }


            res.status(200).json(profile.calendar);
        }
    })

});

module.exports = router;
