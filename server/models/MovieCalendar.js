const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieCalendarSchema = new Schema({
  dateTimeStart: {
    type: Date,
    required: true,
  },

  price: {
    type: Number,
    reqruied: true,
  },

  room: {
    type: Schema.Types.ObjectId,
    ref: "Rooms",
  },

  movie: {
    type: Schema.Types.ObjectId,
    ref: "Movies",
  },
});

module.exports = mongoose.model("MovieCalendars", MovieCalendarSchema);
