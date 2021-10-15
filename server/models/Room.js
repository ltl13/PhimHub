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

  movieCalendars: [
    {
      type: Schema.Types.ObjectId,
      ref: "MovieCalendars",
    },
  ],

  seats: [
    {
      type: Schema.Types.ObjectId,
      ref: "Seats",
    },
  ],
});

module.exports = mongoose.model("Rooms", RoomSchema);
