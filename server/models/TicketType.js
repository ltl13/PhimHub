const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
  },

  tickets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tickets",
    },
  ],
});

module.exports = mongoose.model("TicketTypes", TicketTypeSchema);
