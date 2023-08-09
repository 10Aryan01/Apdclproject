

const schedule=require("node-schedule")
const NotiModel = require("../model/notificationmodel");


const deleteNotificationAtDateTime = (ndate, ntime) => {
  // Combine ndate and ntime to form a valid date-time string
  const combinedDateTime = new Date(`${ndate}T${ntime}:00.000+05:30`);

  // Schedule the deletion at the specified date and time
  schedule.scheduleJob(combinedDateTime, async () => {
    try {
      // Find the notification with matching ndate and ntime
      const matchingNotification = await NotiModel.findOne({
        ndate,
        ntime,
      }).select("_id");

      if (!matchingNotification) {
        throw new Error("Notification not found for the specified date and time.");
      }

      // Delete the matching notification
      await NotiModel.deleteOne({ _id: matchingNotification._id });

      // Log success or perform any other actions if needed
      console.log(`Deleted notification at ndate: ${ndate}, ntime: ${ntime}`);
    } catch (error) {
      console.error("Error while deleting notification:", error);
      throw error;
    }
  });
};

module.exports={deleteNotificationAtDateTime}