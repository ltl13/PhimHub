const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TicketTypes", TicketTypeSchema);
