var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Detail = require('../models/Details.js');

//We're building an API here

/*var newDetail =  new Detail({ date: "a6_12_2016", time: 800, description: "Swimming with Thad" })*/

/* GET /details listing. */
router.get('/', function(req, res, next) {
    console.log(req)
    Detail.find(function(err, details) {
        if (err) return next(err);
        res.json(details);
    });
});

router.get('/:date', function(req, res) {
    Detail.find({ 'date': req.params.date }, function(err, result) {
        if (err) {
            res.status(500)
            res.send(err)
        } else {
            
            res.send(result)
        }
    })
});

router.delete('/', function (req,res){
	console.log(req.body.sending, 'body');
	console.log(req.params, 'params');
	console.log("Got delete request")
	Detail.remove({'_id' : req.body.sending}, function(err, result){
		if (err) {
			console.log(req.body, 'body')
			res.status(500)
			res.send(err)
		}
		else {
			res.send(result)
		}
	})
})


router.post('/', function(req, res) {
    console.log(req.body)
    var detailToSend = new Detail(req.body)
    detailToSend.save(function(err) {
        console.log("Detail saved")
    })
})


/* newDetail.save(function(err) {	  //Mongoose models automatically have .save
  if (err) throw err;

  console.log('Detail saved successfully!');
});*/

module.exports = router;

