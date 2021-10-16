const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WriterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Writers", WriterSchema);
