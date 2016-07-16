var mongoose = require('mongoose');

var detailSchema = new mongoose.Schema({
    date: String,
    time: Number,
    description: String
});

//Each document is an event. I could have gone with a date-based structure, but since
//events are what we're going to be manipulating the most, this makes sense.

module.exports = mongoose.model('Detail', detailSchema);
