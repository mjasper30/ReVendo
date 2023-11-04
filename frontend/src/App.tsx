import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import Dashboard from "./Dashboard";
import AddUser from "./AddUser";
import Monitoring from "./Monitoring";
import AddUnits from "./AddUnits";
import Settings from "./Settings";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>         
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/AddUser" element={<AddUser />}></Route>
          <Route path="/Monitoring" element={< Monitoring/>}></Route>
          <Route path="/AddUnits" element={<AddUnits />}></Route>
          <Route path="/Settings" element={<Settings />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
