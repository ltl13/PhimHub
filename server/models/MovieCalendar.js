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
    ref: "rooms",
  },

  movie: {
    type: Schema.Types.ObjectId,
    ref: "movies",
  },
});

module.exports = mongoose.model("movie_calendars", MovieCalendarSchema);
