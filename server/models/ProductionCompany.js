const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductionCompanySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ProductionCompanies", ProductionCompanySchema);
