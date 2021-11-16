const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  customerType: {
    type: Schema.Types.ObjectId,
    ref: "customer_types",
  },

  account: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  sex: {
    type: Number,
    requried: true,
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
});

module.exports = mongoose.model("customers", CustomerSchema);
