const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieCalendarSchema = new Schema({
  dateTimeStart: {
    type: Date,
    required: true,
  },

  seats: [[{ type: Schema.Types.ObjectId, ref: 'seat', default: null }]],

  columnPreview: [{ type: Number }],

  rowPreview: [{ type: Number }],

  room: {
    type: Schema.Types.ObjectId,
    ref: 'rooms',
  },

  movie: {
    type: Schema.Types.ObjectId,
    ref: 'movies',
  },
});

module.exports = mongoose.model('movie_calendars', MovieCalendarSchema);
