const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  ticket: {
    type: Schema.Types.ObjectId,
    ref: "tickets",
  },

  specialOffer: {
    type: Schema.Types.ObjectId,
    ref: "special_offers",
  },

  staff: {
    type: Schema.Types.ObjectId,
    ref: "staffs",
  },

  payTime: {
    type: Date,
    default: Date.now(),
    required: true,
  },

  value: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("payments", PaymentSchema);
