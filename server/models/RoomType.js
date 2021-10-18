const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("room_types", RoomTypeSchema);
