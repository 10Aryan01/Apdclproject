import React, { useState } from "react";
import "../App.css";
import imgap from "../images/apdcl_logo2-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import imggif from "../images/opgamingmx.gif";
import { useToast } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import axios from "axios";
function Others() {
  const Navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const Phone = queryParams.get("phonenumber");
  const District = queryParams.get("District");
  const Subdivision = queryParams.get("Subdivision");
  const Address = queryParams.get("Address");
  const [pic, setPic] = useState();
  const [Issue, setIssue] = useState();
  const toast = useToast();
  const handlepopup = () => {
    let blur = document.getElementById("blur");
    blur.classList.toggle("active");
    let popup = document.getElementById("popup");
    popup.classList.toggle("active");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    postDetails(file);
  };

  const postDetails = (pic) => {
    if (pic === undefined) {
      toast({
        title: "Please Select an Iamge.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    let picid = document.getElementById("Showimg");
    let newimg = document.createElement("img");
    newimg.src = pic;
    console.log(pic);
    newimg.width = "100%";
    newimg.height = "100%";
    picid.appendChild(newimg);

    if (
      pic.type === "image/jpeg" ||
      pic.type === "image/png" ||
      pic.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chattingapp");
      data.append("cloud_name", "dp2vpccfo");
      fetch("https://api.cloudinary.com/v1_1/dp2vpccfo/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.url) {
            setPic(data.url.toString());

            console.log(data);
          } else {
            console.log("Url not present");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast({
        title: "Please Select an Iamge.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }
  };

  const handlesubmit = async () => {
    console.log(Phone, District, Subdivision, Address, pic);
    if (!Issue || !pic) {
      toast({
        title: "Please Fill All the Details",
        status: "warning",
        duration: 5000,
        inClosable: true,
        position: "bottom",
      });
      return;
    }
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
          title: "Issue allready Exists for this user please Delete your previous Issue ",
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
        let Image = pic;
        console.log(District, Subdivision, Address, Phone, Issue, pic);
        const { data } = await axios.post(
          "http://localhost:5000/api/user/reportissue",
          { District, Subdivision, Address, Phone, Issue, Image },
          config
        );

        toast({
          title: "Issue Raised",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        localStorage.setItem("userInfo", JSON.stringify(data));
        handlepopup();
      }
    } catch (error) {
      toast({
        title: "An issue has been already raised",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <div className="other-home">
      <div className="othrs-wrapper" id="blur">
        <div className="oths-con">
          <div className="other-svg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 2030 1027"
              fill="none"
            >
              <path
                d="M1.26615 352.695C-8.91657 -65.3007 38.8086 -76.5131 273.277 135.795C348.792 204.173 554.546 121.214 654.737 139.648C732.161 153.894 847.747 213.564 1019.63 352.695C1598.9 821.575 1646.17 387.994 1648.9 354.688C1649.02 353.226 1649.06 351.91 1649.09 350.443C1652.43 151.068 1704.84 107.733 1988.57 321.015C2014.74 340.683 2030 371.845 2030 404.579V921C2030 979.542 1982.54 1027 1924 1027H107.266C48.7239 1027 1.26615 979.542 1.26615 921V352.695Z"
                fill="#DD884A"
              />
            </svg>
          </div>
          <div className="others-content">
            <div className="other-logo">
              <img src={imgap} />
              <h1>Others</h1>
            </div>
            <br />
            <br />
            <div className="oths-imp-sec">
              <textarea
                placeholder="Please elaborate your issue"
                rows="2"
                onChange={(e) => {
                  setIssue(e.target.value);
                }}
              />
            </div>
            <br />
            <br />
            <div className="oths-inp-img">
              <input
                type="file"
                id="img-file"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <h2>Provide an Image</h2>
              <div className="select-image">
                <label className="sel-img-line" htmlFor="img-file">
                  <div className="sel-img-overlay" id="Showimg">
                    {pic && (
                      <img
                        src={pic}
                        alt="Selected"
                        style={{
                          borderRadius: "40px",
                          width: "100%",
                          height: "100%"
                        }}
                      />
                    )}
                  </div>
                </label>
              </div>
            </div>
            <div className="oths-butt">
              <button onClick={handlesubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>
      <div className="popupo" id="popup">
        <div className="popup-content">
          <br />
          <h3>Your Issue has been Successfully Registered</h3>
          <button onClick={handlepopup}>Confirm</button>
          <div className="popupicon">
            <img src={imggif} />
          </div>
          {/* <div className="butt-tick-line"></div> */}
        </div>
      </div>
    </div>
  );
}

export default Others;
