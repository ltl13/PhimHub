const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpecialOfferSchema = new Schema({
  code: {
    type: String,
    required: true,
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
    default: true,
  },

  type: {
    type: String,
    enum: ["STATIC", "DYNAMIC"],
  },
});

module.exports = mongoose.model("special_offers", SpecialOfferSchema);
