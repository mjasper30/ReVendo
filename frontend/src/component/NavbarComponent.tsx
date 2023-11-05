import { Avatar, Dropdown, Navbar } from "flowbite-react";
import logo from "../assets/Revendo_logo.png";
import { Link } from "react-router-dom";

export default function NavbarComponent() {
  return (
    <Navbar className="fixed top-0 left-0 w-full z-50 bg-[#7289DA]">
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
          <Link to="/">
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Link>
        </Dropdown>
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
}
