import React, { useState, useEffect } from "react";
import imapd from "../images/apdcl_logo2-removebg-preview.png";
// import img1 from "../images/short-circuit-faulty-electric-wiring-led-to-electrical-fire-electrical-fire-resulting-short-circuit-faulty-250210465.webp";
import axios from "axios";
import {
  Stack,
  Select,
  Input,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  useToast,
} from "@chakra-ui/react";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineNotificationAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Noti_his from "../component/noti_his";
// import Hamburger from "../component/Hamburger";
// import Ham_options from "../component/Ham_options";
import io from "socket.io-client";

// const endpoint = "http://localhost:5000";
// let socket, selectedNoti;

function Dashboard() {
  const [district, setDistrict] = useState();
  const [Subdivision, setSubdivision] = useState();
  const [department, setDepartment] = useState();
  const [issuesData, setIssuesData] = useState([]);
  const [is_large, setIs_large] = useState(false);
  const [selectsubdiv, setSelectsubdiv] = useState([]);

  const [allnoti, setAllnoti] = useState([]);
  const [ndate, setDate] = useState();
  const [ntime, setTime] = useState();
  const [nadd, setAdd] = useState();
  const [nwar, setWar] = useState();
  // const [noti, setNoti] = useState([
  //   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  // ]);

  const toast = useToast();
  const Navigate = useNavigate();
  const handlehampopup = () => {
    let chk = document.getElementById("hpop");
    chk.classList.toggle("visible");
  };

  const enlarge_image = (parms, para) => {
    let get_img = document.getElementById(parms);
    let contain = document.getElementById(para);
    if (is_large === false) {
      contain.style.width = "550px";
      contain.style.height = "550px";
      contain.style.zIndex = 1;
      get_img.style.zIndex = 1;
      get_img.style.transition = "1s";
      get_img.style.cursor = "pointer";
      get_img.style.width = "500px";
      get_img.style.height = "500px";
      setIs_large(true);
    } else {
      contain.style.width = "208px";
      contain.style.height = "90px";
      contain.style.transition = "1s";
      contain.style.zIndex = "0";
      get_img.style.width = "200px";
      get_img.style.height = "110px";
      get_img.style.zIndex = "0";
      get_img.style.transition = "1s";
      setIs_large(false);
    }
  };

  const chkstatus = async (parmas, para) => {
    // const isBoolean = (value) => typeof value === "boolean";
    const val = document.getElementById(parmas);
    let progress = para.status.inProgress;
    if (val.style.background !== "greenyellow") {
      val.style.background = "greenyellow";
      progress = true;
    } else {
      val.style.background = "white";
      progress = false;
    }
    // console.log(isBoolean(para.status.inProgress));
    // console.log(isBoolean(progress));
    // console.log(para);
    // console.log(progress);
    try {
      const endpoint = "http://localhost:5000";
      let socket;
      socket = io(endpoint);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const id = para._id;
      const { data } = await axios.post(
        "http://localhost:5000/api/user/setIssueStat",
        { id, progress },
        config
      );
      socket.emit("newstatus", "status updated");
      localStorage.setItem("statInfo", JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };

  const chkstatus1 = async (parmas, para) => {
    const val = document.getElementById(parmas);
    let done = para.status.done;
    if (val.style.background !== "greenyellow") {
      val.style.background = "greenyellow";
      done = true;
    } else {
      val.style.background = "white";
      done = false;
    }
    try {
      const endpoint = "http://localhost:5000";
      let socket;
      socket = io(endpoint);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const id = para._id;
      const { data } = await axios.post(
        "http://localhost:5000/api/user/setIssueStatdone",
        { id, done },
        config
      );
      socket.emit("newstatus", "status updated");
      localStorage.setItem("statInfo", JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };


  const handleissues = async () => {
    try {
      const { data: Incommingissues } = await axios.get(
        `http://localhost:5000/api/user/allissue?District=${district}&Subdivision=${Subdivision}&Department_id=${department}`
      );

      setIssuesData(Incommingissues);
      if (Incommingissues.length === 0) {
        toast({
          title: "No issue found",
          status: "warning",
          duration: 2000,
          inClosable: true,
          position: "bottom",
        });
        return;
      }
    } catch (error) {
      console.error("Error fetching issues: ", error);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered");

    const setSubdiv = async () => {
      try {
        const { data: Subdiv } = await axios.get(
          `http://localhost:5000/api/user/getsubdiv?District=${district}`
        );
        console.log(Subdiv.subdivisions);
        setSelectsubdiv(Subdiv.subdivisions);
      } catch (error) {
        console.error("Error fetching issues: ", error);
      }
    };
    if (district) {
      setSubdiv();
    }
  }, [district]);

  ////all notifications

  const getallnoti = async () => {
    try {
      const { data: allnoti } = await axios.get(
        "http://localhost:5000/api/user/allnoti"
      );
      setAllnoti(allnoti);
      console.log(allnoti);
    } catch (error) {
      console.log("error in getting all notification " + error);
    }
  };
  useEffect(() => {
    getallnoti();
  }, []);

  const handlenotification = async () => {
    if (!district || !Subdivision || !ndate || !ntime || !nadd || !nwar) {
      toast({
        title: "Please fill all the fields",
        status: "error",
        duration: 2000,
        inClosable: true,
        position: "bottom",
      });
      return;
    } else {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        const Mydate = new Date();
        const options = {
          timeZone: "Asia/Kolkata",
          hour12: false,
        };

        const date = Mydate.toLocaleString("en-IN", options);
        const { data } = await axios.post(
          "http://localhost:5000/api/user/addnotifications",
          { district, Subdivision, ndate, ntime, nadd, nwar, date },
          config
        );
        const endpoint = "http://localhost:5000";
        let socket;
        socket = io(endpoint);
        socket.emit("sendNotification", "notificationsent");
        localStorage.setItem("issueInfo", JSON.stringify(data));

        toast({
          title: "Notification Send",
          status: "success",
          duration: 2000,
          inClosable: true,
          position: "bottom",
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "error",
          status: "error",
          duration: 2000,
          inClosable: true,
          position: "bottom",
        });
        return;
      }
    }
  };

  useEffect(() => {
    const endpoint = "http://localhost:5000";
    let socket;
    console.log("have entered the socket useeffect ");
    socket = io(endpoint);
    socket.on("newnotification", (notification) => {
      console.log(notification);
      getallnoti();
    });
  }, []);

  return (
    <div className="dash_board_wrap">
      <div className="dash-main-con">
        <div className="dash-top">
          <img src={imapd} alt="img" />
          <div className="top-text">
            <h1>
              অসম &nbsp; শক্তি &nbsp; বিতৰণ &nbsp; কোম্পানী &nbsp; লিমিটেড
            </h1>
            <h1>
              ASSAM &nbsp; POWER &nbsp; DISTRIBUTION &nbsp; COMPANY &nbsp;
              LIMITED{" "}
            </h1>
          </div>
          <div className="hamcon">
            <div className="hamburger" onClick={handlehampopup}>
              <div className="hline"></div>
            </div>
            <div className="ham_options" id="hpop">
              <div
                className="options"
                onClick={() => {
                  let chk = document.getElementById("pop_inp");
                  chk.classList.toggle("visible");
                  handlehampopup();
                }}
              >
                Send Notification
                <MdOutlineNotificationAdd size={18} />
              </div>
              <div
                className="options"
                onClick={() => {
                  Navigate("/");
                }}
              >
                Log out
                <IoIosLogOut size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="dash-mid">
          <div className="info-section">
            <h3>Your Credentials : </h3>
            <br />
            <br />
            <div className="admin-line-one">
              <div className="district">
                <label>District : </label>
                <Stack spacing={3}>
                  <Select
                    variant="filled"
                    placeholder="--select"
                    width={"100%"}
                    style={{
                      background: "white",
                      boxShadow: "5px 20px 10px 2px rgba(10,10,10,0.1)",
                    }}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                    }}
                  >
                    <option value="Dibrugarh">Dibrugarh</option>
                    <option value="Sivsagar">Sivsagar</option>
                    <option value="Jorhat">Jorhat</option>
                  </Select>
                </Stack>
              </div>
              <div className="district">
                <label>Sub-Division : </label>
                <Stack spacing={3}>
                  <Select
                    variant="filled"
                    placeholder="--select"
                    width={"100%"}
                    style={{
                      background: "white",
                      boxShadow: "5px 20px 10px 2px rgba(10,10,10,0.1)",
                    }}
                    onChange={(e) => {
                      setSubdivision(e.target.value);
                    }}
                  >
                    {selectsubdiv.map((sd, index) => (
                      <option key={index} value={sd.Subdivision}>
                        {sd.Subdivision}
                      </option>
                    ))}
                  </Select>
                </Stack>
              </div>
            </div>
            <div className="admin-line-two">
              <div className="department">
                <label>Department : </label>
                <Stack spacing={5}>
                  <Select
                    variant="filled"
                    placeholder="--select"
                    width={"100%"}
                    style={{
                      background: "white",
                      boxShadow: "5px 20px 10px 2px rgba(10,10,10,0.1)",
                    }}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                    }}
                  >
                    <option value="D1">Transformer Management</option>
                    <option value="D2">Pole Management</option>
                    <option value="others">Others</option>
                  </Select>
                </Stack>
              </div>
              <div className="button">
                <button onClick={handleissues}>
                  Submit
                  <div className="butt-line"></div>
                </button>
              </div>
            </div>
          </div>
          <div className="issue-report-section">
            <br />
            <br />
            <h3>Issue Details : </h3>
            <div className="sep-line"></div>
            <div className="issue-box" id="isbox">
              <div className="attbs-bar">
                <div className="attbrs">DATE</div>
                <div className="attbrs">Address</div>
                <div className="attbrs">DTR No</div>
                <div className="attbrs">Issue</div>
                <div className="attbrs">Iamge-File</div>
                <div className="attbrs">In progres</div>
                <div className="attbrs">Done</div>
              </div>

              {issuesData.map((issue, index) => (
                <div key={index} className="attbrsissue-bar">
                  <div className="attbrsissue">
                    {issue.createdAt.slice(0, 10)}
                  </div>

                  <div className="attbrsissue">{`${issue.Address}`}</div>
                  <div className="attbrsissue">{`${issue.dtr_no}`}</div>
                  <div className="attbrsissue">{issue.Issue}</div>
                  <div className="attbrsissue" id={issue._id + 200}>
                    {issue.Image !== "NUll" ? (
                      <img
                        src={issue.Image}
                        onClick={() =>
                          enlarge_image(issue._id + 100, issue._id + 200)
                        }
                        className="img"
                        id={issue._id + 100}
                        alt="Issue"
                      />
                    ) : (
                      <img src="" className="img1" />
                    )}
                  </div>
                  <div className="attbrsissue">
                    <div
                      className="circle"
                      id={issue._id}
                      onClick={() => chkstatus(issue._id, issue)}
                      style={{
                        backgroundColor:
                          issue.status.inProgress === true
                            ? "greenyellow"
                            : "white",
                      }}
                    ></div>
                  </div>
                  <div className="attbrsissue">
                    <div
                      className="circle"
                      id={`${issue._id}-${index}`}
                      onClick={() => chkstatus1(`${issue._id}-${index}`, issue)}
                      style={{
                        backgroundColor:
                          issue.status.inProgress === true
                            ? "greenyellow"
                            : "white",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="dash-bot">Bottom</div>
      </div>
      <div className="Send_noti" id="pop_inp">
        <div
          className="close_but"
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <Button
            colorScheme="red"
            width={"10%"}
            style={{
              marginBottom: 25,
              marginRight: "5%",
              marginTop: "5%",
            }}
            onClick={() => {
              let chk = document.getElementById("pop_inp");
              chk.classList.toggle("visible");
            }}
          >
            Close
          </Button>
        </div>
        <Tabs
          variant="soft-rounded"
          colorScheme="green"
          style={{ marginTop: "-40px" }}
        >
          <div className="dash_tabs">
            <TabList>
              <Tab _selected={{ color: "white", bg: "blue.500" }}>
                Send New Notification
              </Tab>
              <Tab _selected={{ color: "white", bg: "blue.500" }}>
                Notification History
              </Tab>
            </TabList>
          </div>
          <TabPanels>
            <TabPanel>
              <div className="noti_content">
                <h2
                  style={{
                    fontSize: "30px",
                    marginTop: "-60px",
                    borderTop: "1px solid red",
                    borderBottom: "1px solid red",
                    width: "100%",
                    textAlign: "center",
                    fontFamily: "Bree Serif",
                  }}
                >
                  New Notifications
                </h2>
                <div className="pop_inp">
                  <div className="noti_sele">
                    <label>District : </label>
                    <Select
                      variant="filled"
                      placeholder="--select"
                      width={"250px"}
                      style={{
                        background: "white",
                        boxShadow: "5px 20px 55px 2px rgba(10,10,10,0.1)",
                      }}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                      }}
                    >
                      <option value="Dibrugarh">Dibrugarh</option>
                      <option value="Sivsagar">Sivsagar</option>
                      <option value="Jorhat">Jorhat</option>
                    </Select>
                  </div>
                  <div className="noti_sele">
                    <label>Sub-Division :</label>
                    <Select
                      variant="filled"
                      placeholder="--select"
                      width={"250px"}
                      style={{
                        background: "white",
                        boxShadow: "5px 20px 55px 2px rgba(10,10,10,0.1)",
                      }}
                      onChange={(e) => {
                        setSubdivision(e.target.value);
                      }}
                    >
                      {selectsubdiv.map((sd, index) => (
                        <option key={index} value={sd.Subdivision}>
                          {sd.Subdivision}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="divedatetimehead">
                  <h2>Set the expiry date for your Notification :</h2>
                </div>
                <div className="setDatetime">
                  <div className="date">
                    <label>Date : </label>
                    <input
                      type="date"
                      className="dateinp"
                      onChange={(e) => {
                        setDate(e.target.value);
                      }}
                    />
                  </div>
                  <div className="time">
                    <label>Time : </label>
                    <input
                      type="time"
                      className="timeinp"
                      onChange={(e) => {
                        setTime(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="address-dashh">
                  <label>Address : </label>
                  <Stack spacing={3}>
                    <Input
                      variant="filled"
                      placeholder="Enter your location"
                      width={"600px"}
                      height={"45px"}
                      style={{
                        backgroundColor: "white",
                        boxShadow: "5px 20px 10px 2px rgba(10,10,10,0.1)",
                      }}
                      onChange={(e) => {
                        setAdd(e.target.value);
                      }}
                    />
                  </Stack>
                </div>
                <div className="noti_text_area">
                  <label>Write Warning :</label>
                  <textarea
                    placeholder="Enter your Warning"
                    rows="2"
                    style={{
                      width: "400px",
                      borderRadius: 10,
                      padding: 10,
                      boxShadow: "5px 20px 10px 2px rgba(10,10,10,0.1)",
                    }}
                    onChange={(e) => {
                      setWar(e.target.value);
                    }}
                  />
                </div>
                <Button
                  colorScheme="blue"
                  width={"30%"}
                  style={{
                    marginTop: 10,
                    alignSelf: "center",
                    boxShadow: "5px 20px 25px 2px rgba(10,10,10,0.1)",
                  }}
                  onClick={handlenotification}
                >
                  Send
                </Button>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="notify_history">
                <h1
                  style={{
                    fontSize: "25px",
                    width: "100%",
                    borderTop: "1px solid red",
                    borderBottom: "1px solid red",
                    textAlign: "center",
                  }}
                >
                  Notification History
                </h1>
                <div className="noti_history_container">
                  {allnoti.map((element, index) => (
                    <Noti_his
                      key={index}
                      date={element.date}
                      issue={element.nwar}
                      district={element.district}
                      subdiv={element.Subdivision}
                    />
                  ))}
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
}

export default Dashboard;
