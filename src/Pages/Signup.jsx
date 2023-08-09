import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.js";
import img2 from "../images/apdcl_logo2-removebg-preview.png";
import image1 from "../images/milad-fakurian-PGdW_bHDbpI-unsplash.jpg";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";

function Signup() {
  const [name, setName] = useState();
  const [phone_Number, setphone_Number] = useState();
  const [Address, setAddress] = useState();
  const [Aadhar_Number, setAadhar_Number] = useState();
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();
  const toast = useToast();
  const handleClick = async () => {
    setLoading(true);
    if (!name || !phone_Number || !Address || !Aadhar_Number) {
      toast({
        title: "Please Fill All the Details",
        status: "warning",
        duration: 1000,
        inClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      console.log(name, phone_Number, Aadhar_Number, Address);
      const { data } = await axios.post(
        "http://localhost:5000/api/user",
        { name, phone_Number, Address, Aadhar_Number },
        config
      );

      toast({
        title: "Registration Successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      Navigate("/");
    } catch (error) {
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="Login_Container">
        <div className="msleft">
          <img src={image1} id="bubb-img" />
          <div className="content">
            <div className="logos">
              <img className="logoi" src={img2} />
              <p>APDCL</p>
            </div>
            {/* <div className="line1">Power Up your life with us &nbsp;<span> ! </span> </div> */}
            <div className="line2">
              <span>J</span>oin Us to experience{" "}
            </div>
            <div className="line3">
              <span>r</span>eliable,<span>e</span>fficent and
            </div>
            <div className="line4">
              {" "}
              <span>s</span>ustainable energy solutions
            </div>
          </div>
        </div>
        <div className="msright">
          <VStack spacing="2px" color="black">
            <h1>Sign Up</h1>
            <FormControl id="first-name" isRequired>
              <FormLabel
                color="white"
                style={{ marginBottom: "50px", marginLeft: "10px" }}
              >
                Name
              </FormLabel>
              <Input
                placeholder="Enter your name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              ></Input>
            </FormControl>
            <FormControl id="Phone Number" isRequired>
              <FormLabel
                color="white"
                style={{ marginBottom: "50px", marginLeft: "10px" }}
              >
                Phone_Number
              </FormLabel>
              <Input
                placeholder="Enter Your Phone Number"
                placeholderStyle={{ fontSize: "5px" }}
                onChange={(e) => {
                  setphone_Number(e.target.value);
                }}
              ></Input>
            </FormControl>
            <FormControl id="Address" isRequired>
              <FormLabel
                color="white"
                style={{ marginBottom: "50px", marginLeft: "10px" }}
              >
                Address
              </FormLabel>
              <InputGroup>
                <Input
                  placeholder="Enter Your Address"
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                />
              </InputGroup>
            </FormControl>
            <FormControl id="Aadhar Number" isRequired>
              <FormLabel
                color="white"
                style={{ marginBottom: "50px", marginLeft: "10px" }}
              >
                Aadhar_Number
              </FormLabel>
              <InputGroup>
                <Input
                  placeholder="Enter Your Aadhar Number"
                  style={{}}
                  onChange={(e) => {
                    setAadhar_Number(e.target.value);
                  }}
                />
              </InputGroup>
            </FormControl>
            <Button
              colorScheme="blue"
              width={"100%"}
              style={{ marginTop: 5 }}
              onClick={handleClick}
              isLoading={loading}
            >
              Sign up
            </Button>
          </VStack>
        </div>
      </div>
    </div>
  );
}

export default Signup;
