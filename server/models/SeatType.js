const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeatTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("SeatTypes", SeatTypeSchema);
