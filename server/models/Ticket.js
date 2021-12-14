const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  price: {
    type: Number,
    //required: true,
  },

  status: {
    type: Boolean,
    required: true,
    default: true,
  },

  movieCalendar: {
    type: Schema.Types.ObjectId,
    ref: 'movie_calendars',
    //required: true,
  },

  ticketType: {
    type: Schema.Types.ObjectId,
    ref: 'ticket_types',
  },

  payment: {
    type: Schema.Types.ObjectId,
    ref: 'payments',
  },

  seats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'seats',
    },
  ],

  customer: {
    type: Schema.Types.ObjectId,
    ref: 'customers',
  },
});

module.exports = mongoose.model('tickets', TicketSchema);
