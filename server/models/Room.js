const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  deletedAt: {
    type: Date,
    default: null,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  roomType: {
    type: Schema.Types.ObjectId,
    ref: 'room_types',
  },
});

module.exports = mongoose.model('rooms', RoomSchema);
