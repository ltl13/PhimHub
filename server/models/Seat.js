const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeatSchema = new Schema({
  code: {
    type: String,
    required: true,
  },

  status: {
    type: Number,
    required: true,
  },

  seatType: {
    type: Schema.Types.ObjectId,
    ref: "SeatTypes",
  },

  room: {
    type: Schema.Types.ObjectId,
    ref: "Rooms",
  },
});

module.exports = mongoose.model("Seats", SeatSchema);
