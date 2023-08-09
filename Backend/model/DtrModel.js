const mongoose = require("mongoose");

const dtrSchema = mongoose.Schema({
  pole_no: {
    type: Number,
  },
  dtr_no: {
    type: Number,
  },
});

const Dtr = mongoose.model("dtr", dtrSchema);
module.exports = Dtr;
