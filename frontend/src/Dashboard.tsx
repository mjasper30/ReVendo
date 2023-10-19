import logo from "./assets/Revendo_logo.png";
import { Avatar, Dropdown, Navbar, Card } from "flowbite-react";
import "./css/index.css";

export default function Dashboard() {
  return (
    <div className="flex">
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
      <div className="fixed sidebar bg-[#313338] text-white w-16 left-0 h-screen flex flex-col justify-center items-center">
        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-md mr-1">
          <span className="material-symbols-rounded text-[#2B2D31] p-2 ">
            home
          </span>
        </i>
        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-full mr-1">
          <span className="material-symbols-rounded text-[#2B2D31] p-2 ">
            add
          </span>
        </i>
        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-full mr-1">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            person_add
          </span>
        </i>
        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-full mr-1">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            monitoring
          </span>
        </i>

        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-full mr-1">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            style
          </span>
        </i>
        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-full mr-1">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            ad_units
          </span>
        </i>
        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-full mr-1">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            manage_accounts
          </span>
        </i>
        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-full mr-1">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            settings
          </span>
        </i>

        {/* Add more sidebar items here */}
      </div>

      <div className="flex-1">
        <h1>Dashboard</h1>
        {/* FIGMA */}
        {/* https://www.figma.com/file/anz0wiQQ08mjdOT430yCCE/REVENDO-LOGIN-PAGE-NEW?type=design&node-id=0-1&mode=design&t=zTyJN98PbElkrQaY-0 */}

        {/* USE CARDS */}
        {/* https://www.flowbite-react.com/docs/components/card */}

        {/* ICONS */}
        {/* https://fonts.google.com/icons?icon.style=Rounded&icon.set=Material+Symbols */}
      </div>
    </div>
  );
}
