const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeatSchema = new Schema({
  code: {
    type: Object,
    required: true,
  },

  status: {
    type: Number,
    required: true,
  },

  seatType: {
    type: Schema.Types.ObjectId,
    ref: 'seat_types',
  },

  room: {
    type: Schema.Types.ObjectId,
    ref: 'rooms',
  },

  ticket: {
    type: Schema.Types.ObjectId,
    ref: 'tickets',
  },
});

module.exports = mongoose.model('seats', SeatSchema);
