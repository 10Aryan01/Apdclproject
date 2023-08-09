const express = require("express");
const {
  registerUser,
  authUser,
  checkifissue,
  getissue,
  getsub_div,
} = require("../controller/userController");
const {
  setIssue,
  setIssueStat,
  setIssueStatdone,
} = require("../controller/issueController");
const { setpole } = require("../controller/poleController");
const { setdtr } = require("../controller/dtrController");
const { setDisSub } = require("../controller/DisSub");
const { setdeleteIssue } = require("../controller/deleteissuecontrol");
const {
  Incomming_noti,
  getNotification,
  getallNotification,
} = require("../controller/notificationcontroller");
const router = express.Router();
// const {checkifissue}=require("../controller/issueController"/)

router.route("/").post(registerUser);
router.post("/login", authUser);
router.route("/reportissue").post(setIssue);
router.route("/checkissue").get(checkifissue); //check if this user allready have an issue
router.route("/allissue").get(getissue);
router.route("/setpole").post(setpole);
router.route("/setdtr").post(setdtr);
router.route("/setSubdiv").post(setDisSub);
router.route("/getsubdiv").get(getsub_div);
router.route("/setIssueStat").post(setIssueStat);
router.route("/setIssueStatdone").post(setIssueStatdone);
router.route("/setdeletedissue").post(setdeleteIssue);
router.route("/addnotifications").post(Incomming_noti);
router.route("/notifordis").get(getNotification);
router.route("/allnoti").get(getallNotification);

module.exports = router;
