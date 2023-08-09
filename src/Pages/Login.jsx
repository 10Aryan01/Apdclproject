import React, { useState } from "react";
import image1 from "../images/milad-fakurian-PGdW_bHDbpI-unsplash.jpg";
import "../App.css";
import img2 from "../images/apdcl_logo2-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
function Login() {
  const Navigate = useNavigate();
  const [phone_Number, setphone_Number] = useState(null);
  const toast = useToast();

  const handleClick = async () => {
    if (phone_Number !== null) {
      if (phone_Number.toLowerCase() === "admin") {
        Navigate("/dashboard");
        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
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
          const { data } = await axios.post(
            "http://localhost:5000/api/user/login",
            { phone_Number },
            config
          );
          toast({
            title: "Login Successful",
            status: "success",
            duration: 1000,
            isClosable: true,
            position: "bottom",
          });
          // setUser(data);
          localStorage.setItem("userInfo", JSON.stringify(data));

          Navigate(`/home?phonenumber=${phone_Number}`);
        } catch (error) {
          toast({
            title: "Wrong Username or Password!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
    } else {
      toast({
        title: "Please fill all the Feilds",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };
  const handleSignup = () => {
    Navigate("/signup");
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        document.getElementById("loginbtn").click();
      }
    };

    const inputElement = document.getElementById("inp");
    inputElement.addEventListener("keypress", handleKeyPress);

    return () => {
      inputElement.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  return (
    <div>
      <div className="Login_Container">
        <div className="mleft">
          <img src={image1} id="bubb-img2" />
          <div className="content">
            <div className="logo">
              <img className="logoi" src={img2} />
              <p>APDCL</p>
            </div>
            <div className="line1">Your Convenience</div>
            <div className="line2">
              is our No <span id="logspan">1</span>
            </div>
            <div className="line3">Priority</div>
          </div>
        </div>
        <div className="mright">
          <h1>LOGIN</h1>
          <input
            className="rinpt"
            id="inp"
            placeholder="Enter registered phone number"
            onChange={(e) => {
              setphone_Number(e.target.value);
            }}
          />
          <br />
          <button id="loginbtn" onClick={handleClick}>
            SUBMIT
          </button>
          <p>Forgot Your Customer id ?</p>
          <p id="su">
            Do you have an Account ? <span onClick={handleSignup}>Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
