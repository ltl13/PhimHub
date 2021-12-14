const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieCalendarSchema = new Schema({
  dateStart: {
    type: Date,
    required: true,
  },

  timeStart: {
    type: Date,
    required: true,
  },

  purchasedTicket: [{ type: Object }],

  size: {
    type: Number,
    defaultValue: 0,
  },

  room: {
    type: Schema.Types.ObjectId,
    ref: 'rooms',
  },

  movie: {
    type: Schema.Types.ObjectId,
    ref: 'movies',
  },

  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('movie_calendars', MovieCalendarSchema);
