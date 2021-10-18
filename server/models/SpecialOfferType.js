const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpecialOfferTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("special_offer_types", SpecialOfferTypeSchema);
