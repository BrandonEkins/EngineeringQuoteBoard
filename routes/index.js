var express = require('express');
var fs = require('fs');
var router = express.Router();
var body = require('body-parser');
var request = require('request');
global.calendars = [];
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("CA4 Server Running");
    res.sendFile('index.html', { root: 'public' });
});

router.post('/savecalendar', function(req, res) {
    for (var i = 0; i < calendars.length; i++) { // checks database for pre existing calendar
        if (calendars[i].user == req.query.q) {
            calendars[i] = { user: req.query.q, calendar: req.body };
        }
    }
    res.end('success');
});

router.get('/getnames', function(req,res,next) {
    var names = [];
    for(var i = 0; i < calendars.length; i++){
        names.push(calendars[i].user);
    }
   res.status(200).json(names); 
});


router.get('/getcalendar', function(req, res, next) {
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
        global.calendars.push({ user: profile.user, calendar: profile.calendar });
    }


    res.status(200).json(profile.calendar);
});

module.exports = router;
