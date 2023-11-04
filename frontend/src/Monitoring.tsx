import logo from "./assets/Revendo_logo.png";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import "./css/index.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="bg-[#1E1F22] h-full w-screen flex">
      <div className="fixed sidebar bg-[#35363D] text-white w-20 h-screen flex flex-col justify-center items-center">
        <Link
          className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
          to="/dashboard"
        >
          <i>
            <span className="material-symbols-rounded text-[#2B2D31] p-2">
              {/* White Rectacle Active */}
              <div className="vertical-rectangle absolute top-0 left-[-14px] w-2 h-10 bg-white rounded-lg"></div>
              dashboard
            </span>
          </i>
        </Link>
        <Link
          className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
          to="/AddUser"
        >
          <i>
            <span className="material-symbols-rounded text-[#2B2D31] p-2">
              style
            </span>
          </i>
        </Link>
        <Link
          className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
          to="/AddUser"
        >
          <i>
            <span className="material-symbols-rounded text-[#2B2D31] p-2">
              ad_units
            </span>
          </i>
        </Link>
        <Link
          className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
          to="/AddUser"
        >
          <i>
            <span className="material-symbols-rounded text-[#2B2D31] p-2">
              manage_accounts
            </span>
          </i>
        </Link>
        <Link
          className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
          to="/AddUser"
        >
          <i>
            <span className="material-symbols-rounded text-[#2B2D31] p-2">
              settings
            </span>
          </i>
        </Link>
      </div>

      <div className="flex flex-col flex-1 w-full">
        <Navbar
          fluid
          rounded
          className="fixed top-0 left-0 w-full z-50 bg-[#7289DA]"
        >
          <Navbar.Brand>
            <img src={logo} className="mr-1 h-10 sm:h-15" alt="ReVendo Logo" />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-white">
              ReVendo
            </span>
          </Navbar.Brand>
          <div className="flex md:order-2">
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User settings"
                  img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">Jasper Macaraeg</span>
                <span className="block truncate text-sm font-medium">
                  jasper.macaraeg42@gmail.com
                </span>
              </Dropdown.Header>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Sign out</Dropdown.Item>
            </Dropdown>
            <Navbar.Toggle />
          </div>
        </Navbar>

        <div className="flex flex-col ml-24">
          <div className="font-bold text-xl text-white ml-10">Dashboard</div>
        </div>
      </div>
    </div>
  );
}
