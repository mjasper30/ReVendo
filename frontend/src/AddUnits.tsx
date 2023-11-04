import "./css/index.css";
import logo from "./assets/Revendo_logo.png";
import { Avatar, Dropdown, Navbar} from "flowbite-react";
import { SidebarData } from './SidebarData';

export default function Dashboard() {
  return (
    <>
    <div className="flex flex-col flex-1 w-full">
        <Navbar
          fluid
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
    </div>

    <div className="h-full w-screen flex items-center justify-center">
      <h1>Add Units</h1>
      </div>
      <div className="fixed sidebar bg-[#35363D] text-white w-20 h-screen flex flex-col justify-center items-center">
        <ul>
          {SidebarData.map((val, key) => {
            return (
              <li key = {key} onClick = { () => {
                window.location.pathname = val.link}}
                > 
                {" "}
                <div className = "py-2">{val.icon}</div>{" "}
                <div>
                </div>
                </li>
            )})}
            </ul>
            </div>
  </>
  )
}
