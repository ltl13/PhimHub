const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
  },

  seats: [[{ type: Schema.Types.ObjectId, ref: 'seat_types', default: null }]],
});

module.exports = mongoose.model('room_types', RoomTypeSchema);
