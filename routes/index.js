var express = require('express');
var router = express.Router();
require('datejs')


var d = new Date();
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

var m = month[d.getMonth()];
var y = d.getYear() + 1900


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { month: m, year: y });
});

module.exports = router;
