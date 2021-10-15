const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeatTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
  },

  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Seats",
    },
  ],
});

module.exports = mongoose.model("SeatTypes", SeatTypeSchema);
