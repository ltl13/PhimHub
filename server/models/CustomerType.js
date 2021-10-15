const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
    unique: true,
  },

  customers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Customers",
    },
  ],
});

module.export = mongoose.model("CustomerTypes", CustomerTypeSchema);
