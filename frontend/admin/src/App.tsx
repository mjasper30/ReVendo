import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import RFID from "./RFID";
import Units from "./Units";
import Accounts from "./Accounts";
import History from "./History";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
          <Route path="/rfid" element={<RFID />}></Route>
          <Route path="/manage-accounts" element={<Accounts />}></Route>
          <Route path="/units" element={<Units />}></Route>
          <Route path="/history" element={<History />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
