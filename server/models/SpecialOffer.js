const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpecialOfferSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },

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
    ref: "special_offer_types",
  },
});

module.exports = mongoose.model("special_offers", SpecialOfferSchema);
