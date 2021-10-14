const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerTypeSchema = new Schema({
  typeName: { type: String, required: true, unique: true },
});

module.export = mongoose.model("customerTypes", CustomerTypeSchema);
