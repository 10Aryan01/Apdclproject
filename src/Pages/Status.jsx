import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../App.css";
import imgap from "../images/apdcl_logo2-removebg-preview.png";
import axios from "axios";
import { Stack, Select, Button, HStack } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import io from "socket.io-client";
function Status() {
  const location = useLocation();
  const Phone = new URLSearchParams(location.search).get("phonenumber");
  const [district, setDistrict] = useState();
  const [Subdivision, setSubdivision] = useState();
  const [issueinfo, setIssueInfo] = useState();
  const [issues, setIssuesData] = useState([]);
  const [selectsubdiv, setSelectsubdiv] = useState([]);
  const [inpro, setInpro] = useState();
  const [done, setdone] = useState();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [deleteobjectdata, setDeleteobject] = useState([]);
  const [pending, setPen] = useState(false);
  const toast = useToast();

  const handlestatus = async () => {
    if (!district || !Subdivision || !issueinfo) {
      toast({
        title: "Please fill all inputs.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      let department;
      if (issueinfo === "Transformer") {
        department = "D1";
      } else if (issueinfo === "Pole") {
        department = "D2";
      } else {
        department = "others";
      }
      try {
        const { data: Incommingissues } = await axios.get(
          `http://localhost:5000/api/user/allissue?District=${district}&Subdivision=${Subdivision}&Department_id=${department}`
        );

        console.log(district);
        console.log(Subdivision);
        console.log(department);
        console.log(Incommingissues);
        setIssuesData(Incommingissues);
        console.log(Phone);
        let chk = false;
        const phoneNumberInt = parseInt(Phone, 10);
        Incommingissues.forEach((element) => {
          setPen(true);
          if (element.Phone === phoneNumberInt) {
            chk = true;
            setInpro(element.status.inProgress);
            setdone(element.status.done);
            let del_sec = document.getElementById("del_sec");
            del_sec.style.transition = "0.5s";
            del_sec.style.display = "block";

            if (element.status.done === true) {
              setIsButtonDisabled(false);
              setDeleteobject(element);
            } else {
              setIsButtonDisabled(true);
            }
          }
        });
        if (chk === false) {
          toast({
            title: "No Issue found as per your Description.",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      } catch (error) {
        console.error("No status found", error);
      }
    }
  };

  useEffect(() => {
    console.log("useEffect triggered");
    console.log(district);
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

  const handledelete = async (element) => {
    console.log("button clicked");
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      console.log("this is delete element " + element);
      const CustomerNo = element.CustomerNo;
      const District = element.District;
      const Subdivision = element.Subdivision;
      const Address = element.Address;
      const Phone = element.Phone;
      const Department_id = element.Department_id;
      const Issue = element.Issue;
      const dtr_no = element.dtr_no;
      const Image = element.Image;
      const inProgress = element.status.inProgress;
      const done = element.status.done;
      const { data } = await axios.post(
        "http://localhost:5000/api/user/setdeletedissue",
        {
          CustomerNo,
          District,
          Subdivision,
          Address,
          Phone,
          Department_id,
          Issue,
          dtr_no,
          Image,
          inProgress,
          done,
        },
        config
      );
      localStorage.setItem("issueInfo", JSON.stringify(data));
      toast({
        title: "Successfully Deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const endpoint = "http://localhost:5000";
    let socket;
    socket = io(endpoint);
    socket.on("statuschanged", (notification) => {
      console.log(notification);
      handlestatus();
    });
    return () => {
      socket.disconnect();
    };
  }, [district, Subdivision, issueinfo]);

  return (
    <>
      <div className="status-wrapper">
        <div className="main-stat-back">
          <div className="svg-class-status">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="99.4%"
              height="137%"
              viewBox="0 0 2010 490"
              fill="none"
            >
              <path
                d="M2.09577 319.884C2.41326 294.816 11.0585 270.367 27.9372 251.83C108.757 163.071 209.365 99.4068 413.042 198.128C413.042 198.128 1452.32 821.426 1011.78 281.101C571.23 -259.224 1706.26 145.645 1706.26 145.645L1900.72 240.009C1906.34 242.74 1911.72 245.954 1916.79 249.616L1968.34 286.84C1990.74 303.011 2004 328.954 2004 356.577V356.577V484C2004 543.647 1955.65 592 1896 592H102.412C50.5396 592 5.37405 555.075 2.51388 503.281C-0.348718 451.444 1.14732 394.769 2.09577 319.884Z"
                fill="#728FD3"
              />
            </svg>
          </div>
          <div className="content-status">
            <div className="stat-logo">
              <img src={imgap} />
              <h1>Status</h1>
            </div>
            <div className="select-stat">
              
                <div className="stat-issue-box-2">
                  <label>Select your district</label>
                  <Select
                    variant="filled"
                    placeholder="--select"
                    width={"200px"}
                    style={{
                      background: "white",
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
                  <div className="stat-issue-box-2">
                  <label>Select your subdivision</label>
                  <Select
                    variant="filled"
                    placeholder="--select"
                    width={"200px"}
                    style={{
                      background: "white",
                    }}
                    onChange={(e) => {
                      setSubdivision(e.target.value);
                    }}
                  >
                    {selectsubdiv.map((sd, index) => (
                      <option key={sd._id} value={sd.Subdivision}>
                        {sd.Subdivision}
                      </option>
                    ))}
                  </Select>
                  </div>
                  <div className="stat-issue-box">
                  <label>Select your issue</label>
                  <Select
                    variant="filled"
                    placeholder="--select"
                    width={"100%"}
                    style={{
                      background: "white",
                    }}
                    onChange={(e) => {
                      setIssueInfo(e.target.value);
                    }}
                  >
                    <option value="Transformer">
                      Transformer related issue
                    </option>
                    <option value="Pole">Pole related issue</option>
                    <option value="others">Others</option>
                  </Select>
                  </div>
                
                <Stack
                  direction="row"
                  spacing={4}
                  align="center"
                  marginTop={"34px"}
                >
                  <Button
                    colorScheme="teal"
                    variant="solid"
                    onClick={handlestatus}
                  >
                    Search
                  </Button>
                </Stack>
              
            </div>
            <div className="feedback">
              <div className="stages">
                <div
                  className="stst-clr "
                  id="clr-one"
                  style={{
                    backgroundColor: pending === true ? "greenyellow" : "white",
                  }}
                ></div>
                <div className="messagestat">Pending</div>
              </div>
              <div className="status-line"></div>
              <div className="stages">
                <div
                  className="stst-clr"
                  id="clr-two"
                  style={{
                    backgroundColor: inpro === true ? "greenyellow" : "white",
                  }}
                ></div>
                <div className="messagestat">Working on it</div>
              </div>
              <div className="status-line done-stat-bar"></div>
              <div className="stages">
                <div
                  className="stst-clr"
                  id="clr-three"
                  style={{
                    backgroundColor: done === true ? "greenyellow" : "white",
                  }}
                ></div>
                <div className="messagestat ">Done</div>
              </div>
            </div>
            <div
              className="delete_div"
              style={{ display: "none" }}
              id="del_sec"
            >
              <h2>You can delete your issue when its Status is done</h2>
              <Button
                colorScheme="red"
                variant="solid"
                onClick={() => handledelete(deleteobjectdata)}
                isDisabled={isButtonDisabled}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Status;
