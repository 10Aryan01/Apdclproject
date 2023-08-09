const mongoose = require("mongoose");

const Notification_Schema = mongoose.Schema({
  district: {
    type: String,
  },
  Subdivision: {
    type: String,
  },
  ndate: {
    type: String,
  },
  ntime: {
    type: String,
  },
  nadd: {
    type: String,
  },
  nwar: {
    type: String,
  },
  date: {
    type: String,
  },
});

const NotiModel = mongoose.model("Notifications", Notification_Schema);
module.exports = NotiModel;
