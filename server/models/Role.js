const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },

  funcs: [
    {
      type: Schema.Types.ObjectId,
      ref: "funcs",
    },
  ],
});

module.exports = mongoose.model("roles", RoleSchema);
