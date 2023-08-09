const mongoose = require("mongoose");

const poleSchema = mongoose.Schema({
  pole_no: {
    type: Number,
  },
  CustomerNo: {
    type: Number,
  },
});

const Pole = mongoose.model("pole", poleSchema);
module.exports = Pole;
