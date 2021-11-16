const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  customerType: {
    type: Schema.Types.ObjectId,
    ref: "customer_types",
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  token: {
    type: String,
  },

  name: {
    type: String,
    required: true,
  },

  sex: {
    type: Number,
    required: true,
  },

  dateOfBirth: {
    type: Date,
    required: true,
  },

  status: {
    type: Boolean,
    required: true,
    default: true,
  },

  createAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("customers", CustomerSchema);
