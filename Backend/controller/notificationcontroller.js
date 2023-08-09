const asyncHandler = require("express-async-handler");
const NotiModel = require("../model/notificationmodel");
const {deleteNotificationAtDateTime} = require("../Jobschedule/schedule");

const Incomming_noti = asyncHandler(async (req, res) => {
  const { district, Subdivision, ndate, ntime, nadd, nwar, date } = req.body;

  if (
    !district ||
    !Subdivision ||
    !ndate ||
    !ntime ||
    !nadd ||
    !nwar ||
    !date
  ) {
    throw new Error("All fields not delivered");
  }

  const notification = await NotiModel.create({
    district,
    Subdivision,
    ndate,
    ntime,
    nadd,
    nwar,
    date,
  });

  if (notification) {
    res.status(200).json({
      district: notification.district,
      Subdivision: notification.Subdivision,
      ndate: notification.ndate,
      ntime: notification.ntime,
      nadd: notification.nadd,
      nwar: notification.nwar,
      date: notification.date,
    });
  } else {
    res.status(400);
    throw new Error("Issue not registered");
  }
  deleteNotificationAtDateTime(ndate, ntime);
});

const getNotification = asyncHandler(async (req, res) => {
  const district = req.query.District;
  const Subdivision = req.query.Subdivision;
  //   console.log(Dis, Subdiv, dept);
  const allnotification = await NotiModel.find({
    district: district,
    Subdivision: Subdivision,
  }).sort("-date");

  res.send(allnotification);
  // console.log(allnotification);
});

const getallNotification = asyncHandler(async (req, res) => {
  const evrynotification = await NotiModel.find({}).sort("-date");
  res.send(evrynotification);
});

module.exports = {
  Incomming_noti,
  getNotification,
  getallNotification,
};
