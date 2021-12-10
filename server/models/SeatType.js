const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeatTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
  },

  size: {
    type: Number,
    required: true,
    default: 1,
  },

  deletedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('seat_types', SeatTypeSchema);
