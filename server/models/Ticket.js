const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  price: {
    type: Number,
    required: true,
  },

  dateTimeStart: {
    type: Date,
    required: true,
  },

  movie: {
    type: Schema.Types.ObjectId,
    ref: "Movies",
  },

  ticketType: {
    type: Schema.Types.ObjectId,
    ref: "TicketTypes",
  },

  payment: {
    type: Schema.Types.ObjectId,
    ref: "Payments",
  },

  seats: [
    {
      type: Schema.Types.ObjectId,
      ref: "Seats",
    },
  ],

  customers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Customers",
    },
  ],
});

module.exports = mongoose.model("Tickets", TicketSchema);
