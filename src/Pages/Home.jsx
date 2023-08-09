import React, { useState } from "react";
import "../App.css";
import img2 from "../images/apdcl_logo2-removebg-preview.png";
import img3 from "../images/icons8-status-50.png"
import { useNavigate } from "react-router-dom";
import imggif from "../images/opgamingmx.gif";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineNotificationAdd } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { GrInProgress } from "react-icons/gr";
import io from "socket.io-client";
import { Button, Input, Stack, Select } from "@chakra-ui/react";
import { useEffect } from "react";
import imgwar from "../images/warning.webp";

function Home() {
  const location = useLocation();
  const Phone = new URLSearchParams(location.search).get("phonenumber");
  const [District, setDistrict] = useState();
  const [Subdivision, setSubdivision] = useState();
  const [Address, setAddress] = useState();
  const [Issue, setIssue] = useState();
  const [selectsubdiv, setSelectsubdiv] = useState([]);
  const Navigate = useNavigate();
  const toast = useToast();
  // const [notidata, setNotidata] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1]);
  const [notfy, setnewnoti] = useState([]);
  const [notiopen, setNotiopen] = useState(false);


  const npopup = () => {
    let palert = document.getElementById("palert");
    if (notfy.length !== 0 && notiopen === false) {
      palert.classList.add('visible');
    }
    else if (notfy.length === 0 || notiopen === true) {
      palert.classList.remove('visible');
    }
    else {
      console.log("No Notifications");
    }
  };
  useEffect(() => {
    npopup();
  }, [notfy.length]);

  const handlepopup = () => {
    let blur = document.getElementById("blur1");
    blur.classList.toggle("active");
    let popup = document.getElementById("popup1");
    popup.classList.toggle("active");
  };

  const handlestatus = () => {
    Navigate(`/status?phonenumber=${encodeURIComponent(Phone)}`);
  };

  const handleothers = async () => {
    if (!District || !Subdivision || !Address || !Issue) {
      toast({
        title: "Please Fill All the Details",
        status: "warning",
        duration: 1000,
        inClosable: true,
        position: "bottom",
      });
      return;
    }
    if (Issue !== "others") {
      try {
        let Dept;
        if (Issue === "Transformer") {
          Dept = "D1";
        } else if (Issue === "Pole") {
          Dept = "D2";
        } else {
          Dept = "others";
        }

        const { data: Check_if_allready_present } = await axios.get(
          `http://localhost:5000/api/user/checkissue?Phone=${Phone}&Department_id=${Dept}`
        );

        const isEmpty =
          !Check_if_allready_present ||
          Object.keys(Check_if_allready_present).length === 0;

        if (!isEmpty) {
          toast({
            title: "Issue allready Exists for this User.Please Delete your previous Issue ",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        } else {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          // console.log(District, Subdivision, Address, Issue, Phone);

          const { data } = await axios.post(
            "http://localhost:5000/api/user/reportissue",
            { District, Subdivision, Address, Phone, Issue },
            config
          );
          localStorage.setItem("issueInfo", JSON.stringify(data));
          handlepopup();
        }
      } catch (error) {
        toast({
          title: "Error is Registering",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        console.log(error);
      }
    } else {
      Navigate(
        `/others?phonenumber=${encodeURIComponent(
          Phone
        )}&District=${encodeURIComponent(
          District
        )}&Subdivision=${encodeURIComponent(
          Subdivision
        )}&Address=${encodeURIComponent(Address)}`
      );
    }
  };
  useEffect(() => {
    console.log("useEffect triggered");
    console.log(District);
    const setSubdiv = async () => {
      try {
        const { data: Subdiv } = await axios.get(
          `http://localhost:5000/api/user/getsubdiv?District=${District}`
        );
        console.log(Subdiv.subdivisions);
        // const { subdivisions } = Subdiv.data;
        setSelectsubdiv(Subdiv.subdivisions);
      } catch (error) {
        console.error("Error fetching issues: ", error);
      }
    };
    if (District) {
      setSubdiv();
    }
  }, [District]);

  useEffect(() => {
    if (Issue === "others") {
      let sub_but = document.getElementById("submitbut");
      sub_but.style.transition = "1s";
      sub_but.innerHTML = "Next";
    } else {
      let sub_but = document.getElementById("submitbut");
      sub_but.style.transition = "1s";
      sub_but.innerHTML = "Submit";
    }
  }, [Issue]);

  const handlehampopup = () => {
    let chk = document.getElementById("hpop");
    chk.classList.toggle("visible");
  };

  const handlenotification = () => {
    let chk = document.getElementById("h_notification");
    chk.classList.toggle("visible");
    setNotiopen(true);
    npopup();
  };

  const Getnotification = async () => {
    try {
      console.log(District, Subdivision);
      const { data: newnoti } = await axios.get(
        `http://localhost:5000/api/user/notifordis?District=${District}&Subdivision=${Subdivision}`
      );
      setnewnoti(newnoti);
    } catch (error) {
      console.log("error in getting all notification " + error);
    }
  };

  useEffect(() => {
    Getnotification();
  }, [District, Subdivision]);

  useEffect(() => {
    const endpoint = "http://localhost:5000";
    let socket;
    console.log("have entered the socket useeffect ");
    socket = io(endpoint);
    socket.on("newnotification", (notification) => {

      console.log(notification);
      Getnotification();
    });
    return () => {
      socket.disconnect();
    };
  }, [District, Subdivision]);

  return (
    <div className="home">
      <div className="showalert" id="palert">
        <div className="arr"></div>
        Hey!! You have a new notifications please check before posting your issue
      </div>
      <div className="home-con" id="blur1">
        <div className="wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="2441" height="750" viewBox="0 0 2441 750" fill="none">
  <path d="M0.996704 0.0944824L2441 0V454C2441 454 2436.89 675.538 1925.04 454.091C1413.19 232.644 205.925 -221.28 751.106 491.58C1052.02 885.041 655.12 725.609 447.649 675.444C240.178 625.279 0.996704 470.241 0.996704 470.241V0.0944824Z" fill="#FE994F"/>
</svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="2411" height="50%" viewBox="0 0 2411 592" fill="none">
            <path d="M0 210.417C105.561 107.92 177.009 88.8131 454.317 198.128C454.317 198.128 1732.18 821.426 1190.5 281.101C648.819 -259.224 2044.41 145.645 2044.41 145.645L2293.9 244.113L2410.5 315.083V365.083V592H0V210.417Z" fill="#728FD3" />
          </svg>
        </div>
        <div className="home-content">
          <div className="hlogo">
            <div className="img_title">
              <img className="logoi" src={img2} alt="img" />
              <p>APDCL</p>
            </div>
            <div className="hp_hamburger">
              <div className="hamcon">
                <div className="hamoptionforhome" id="hpop">
                  <div
                    className="options"
                    onClick={() => {
                      handlehampopup();
                      handlenotification();
                    }}

                  >
                    NOTIFICATIONS
                    <MdOutlineNotificationAdd size={20} />
                  </div>
                  <div className="options" onClick={handlestatus}>
                    STATUS
                    <img src={img3} className="statusicon" />
                  </div>
                  <div
                    className="options"
                    onClick={() => {
                      Navigate("/");
                    }}
                  >
                    LOG OUT
                    <IoIosLogOut size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text">
            <h1>
              Please Register your issue, Your problem will be addressed as soon
              as possible
            </h1>
          </div>
          <div className="select1-inp-line">
            <div className="select-content">
              <Stack spacing={3}>
                <label>District</label>
                <Select
                  variant="filled"
                  placeholder="-- Select"
                  height={"50px"}
                  width={'300px'}
                  // onChange={(e) => {
                  //   setDistrict(e.target.value);
                  // }}
                  onClick={(e) => {
                    setDistrict(e.target.value);
                  }}
                  style={{
                    backgroundColor: "rgb(240, 240, 250)",
                    boxShadow: "5px 30px 100px 2px rgba(0,0,0,0.5)",
                    // width:"16vw"

                  }}
                >
                  <option value="Dibrugarh">Dibrugarh</option>
                  <option value="Sivsagar">Sivsagar</option>
                  <option value="Jorhat">Jorhat</option>
                </Select>
              </Stack>
            </div>
            <Stack>
              <label>Sub-division</label>
              <Select
                variant="filled"
                placeholder="-- Select"
                width={'300px'}
                height={"50px"}
                onChange={(e) => {
                  setSubdivision(e.target.value);
                  // Getnotification();
                }}
                style={{
                  backgroundColor: "rgb(240, 240, 250)",
                  boxShadow: "5px 30px 100px 10px rgba(0,0,0,0.3)",
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
          <div className="select2-inp-line">
            <label>Address</label>
            <Input
              variant="filled"
              placeholder="Enter your location"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              style={{
                backgroundColor: "rgb(240, 240, 240)",
                boxShadow: "5px 30px 100px 10px rgba(0,0,0,0.3)",
              }}
            />
          </div>
          <div className="select3-inp-line">
            <label>Select your issue</label>
            <Select
              variant="filled"
              placeholder="-- Select"
              width={'70%'}
              height={'60px'}
              onChange={(e) => {
                setIssue(e.target.value);
              }}
              style={{
                backgroundColor: "rgb(240, 240, 240)",
                boxShadow: "5px 30px 100px 10px rgba(0,0,0,0.3)",

              }}
            >
              <option value="Transformer">Transformer related issue</option>
              <option value="Pole">Pole related issue</option>
              <option value="others">Others</option>
            </Select>
          </div>

          <div className="sub-but">
            <button onClick={handleothers} id="submitbut">
              Submit
            </button>
          </div>
        </div>
      </div>
      <div className="popup1" id="popup1">
        <div className="popup1-content">
          <h3>Your Issue has been Successfully Registered</h3>
          <button onClick={handlepopup}>Confirm</button>
          <div className="popup1icon">
            <img src={imggif} alt="img" />
          </div>
        </div>
      </div>
      <div className="h_notification" id="h_notification">
        <div className="h_noti_content">
          <div className="noti_head">
            <h3>Your Notifications : </h3>
            <Button
              onClick={handlenotification}
              style={{
                backgroundColor: "rgba(255,100,50,1)",
              }}
              color={"white"}
            >
              Close
            </Button>
          </div>
          <div className="allnotifi">
            <ul style={{ listStyle: "none" }}>
              {notfy.map((element, index) => (
                <li className="notify" key={index}>
                  <div className="himg">
                    <img src={imgwar} alt="image" />
                  </div>
                  <div className="hnotification">{element.nwar}</div>
                  <div className="hdatetime">
                    <div className="hdate">{element.date.slice(0, 9)}</div>
                    <div className="hdate">{element.date.slice(11, 19)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
