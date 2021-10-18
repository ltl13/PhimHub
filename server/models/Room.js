const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  status: {
    type: Boolean,
    required: true,
  },

  numberSeat: {
    type: Number,
    required: true,
  },

  capacity: {
    type: Number,
    required: true,
  },

  roomType: {
    type: Schema.Types.ObjectId,
    ref: "room_types",
  },
});

module.exports = mongoose.model("rooms", RoomSchema);
