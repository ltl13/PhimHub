const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
  },

  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rooms",
    },
  ],
});

module.exports = mongoose.model("RoomTypes", RoomTypeSchema);
