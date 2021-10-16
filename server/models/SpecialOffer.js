const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpecialOfferSchema = new Schema({
  expire: {
    type: Date,
    required: true,
  },

  value: {
    type: Number,
    require: true,
  },

  status: {
    type: Boolean,
    required: true,
  },

  specialOfferType: {
    type: Schema.Types.ObjectId,
    ref: "SpecialOfferTypes",
  },
});

module.exports = mongoose.model("SpecialOffers", SpecialOfferSchema);
