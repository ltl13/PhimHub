const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  ticket: {
    type: Schema.Types.ObjectId,
    ref: "Tickets",
  },
  specialOffer: {
    type: Schema.Types.ObjectId,
    ref: "SpecialOffers",
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staffs",
  },
  paytime: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

module.export = mongoose.model("Payments", PaymentSchema);
