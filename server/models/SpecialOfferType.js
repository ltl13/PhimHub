const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpecialOfferTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
  },

  specialOffers: [
    {
      type: Schema.Types.ObjectId,
      ref: "SpecialOffers",
    },
  ],
});

module.exports = mongoose.model("SpecialOfferTypes", SpecialOfferTypeSchema);
