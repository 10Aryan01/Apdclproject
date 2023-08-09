import logo from "./logo.svg";
import "./App.css";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Status from "./Pages/Status";
import Others from "./Pages/others";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Dateaandtime from "./component/dateaand time";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/" element={<Dateaandtime />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/status" element={<Status />} />
          <Route path="/others" element={<Others />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
