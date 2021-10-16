const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  status: {
    type: Boolean,
    required: true,
  },

  numberSear: {
    type: Number,
    required: true,
  },

  capacity: {
    type: Number,
    required: true,
  },

  roomType: {
    type: Schema.Types.ObjectId,
    ref: "RoomTypes",
  },
});

module.exports = mongoose.model("Rooms", RoomSchema);
