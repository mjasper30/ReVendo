import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import RFID from "./RFID";
import Accounts from "./Accounts";
import History from "./History";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
          <Route path="/rfid" element={<RFID />}></Route>
          <Route path="/manage-accounts" element={<Accounts />}></Route>
          <Route path="/history" element={<History />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
