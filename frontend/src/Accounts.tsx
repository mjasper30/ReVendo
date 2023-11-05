import logo from "./assets/Revendo_logo.png";
import {
  Avatar,
  Button,
  Dropdown,
  Label,
  Modal,
  Navbar,
  Radio,
  Select,
  Table,
  TextInput,
  Tooltip,
} from "flowbite-react";
import "./css/index.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Accounts() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="h-full w-screen flex">
      <div className="fixed sidebar bg-[#35363D] text-white w-20 h-screen flex flex-col justify-center items-center z-50">
        <Link
          className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
          to="/dashboard"
        >
          <Tooltip content="Dashboard" placement="right">
            <i>
              <span className="material-symbols-rounded text-[#2B2D31] p-2">
                dashboard
              </span>
            </i>
          </Tooltip>
        </Link>
        <Link
          className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
          to="/rfid"
        >
          <Tooltip content="RFID" placement="right">
            <i>
              <span className="material-symbols-rounded text-[#2B2D31] p-2">
                style
              </span>
            </i>
          </Tooltip>
        </Link>
        <Link
          className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
          to="/units"
        >
          <Tooltip content="Units" placement="right">
            <i>
              <span className="material-symbols-rounded text-[#2B2D31] p-2">
                ad_units
              </span>
            </i>
          </Tooltip>
        </Link>
        <Link
          className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
          to="/manage-accounts"
        >
          <Tooltip content="Accounts" placement="right">
            <i>
              <span className="material-symbols-rounded text-[#2B2D31] p-2">
                {/* White Rectacle Active */}
                <div className="vertical-rectangle absolute top-0 left-[-14px] w-2 h-10 bg-white rounded-lg"></div>
                manage_accounts
              </span>
            </i>
          </Tooltip>
        </Link>
        <Link
          className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
          to="/settings"
        >
          <Tooltip content="Settings" placement="right">
            <i>
              <span className="material-symbols-rounded text-[#2B2D31] p-2">
                settings
              </span>
            </i>
          </Tooltip>
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

        <div className="flex items-center justify-center h-full">
          <div className="w-full sm:w-4/5">
            <div className="font-bold text-xl text-white my-10">
              Manage Accounts
            </div>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
              <Modal.Header>Add User</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form className="flex flex-col gap-4">
                    <div className="block">
                      <Label htmlFor="name" value="Name" />
                    </div>
                    <TextInput
                      id="name"
                      type="text"
                      placeholder="Enter name"
                      required
                    />
                    <div className="block">
                      <Label htmlFor="email" value="Email" />
                    </div>
                    <TextInput
                      id="email"
                      type="text"
                      placeholder="Enter email"
                      required
                    />
                    <fieldset className="flex flex-col gap-4">
                      <div className="block">
                        <Label value="Gender" />
                      </div>
                      <div className="flex items-center gap-12">
                        <div className="flex items-center gap-2">
                          <Radio
                            id="united-state"
                            name="countries"
                            value="USA"
                          />
                          <Label htmlFor="united-state">Male</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Radio
                            id="united-state"
                            name="countries"
                            value="USA"
                          />
                          <Label htmlFor="united-state">Female</Label>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label htmlFor="password1" value="Your password" />
                        </div>
                        <TextInput id="password1" type="password" required />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label htmlFor="password2" value="Confirm password" />
                        </div>
                        <TextInput id="password2" type="password" required />
                      </div>
                    </fieldset>
                    <div className="max-w">
                      <div className="mb-2 block">
                        <Label htmlFor="role" value="Role" />
                      </div>
                      <Select id="role" required>
                        <option>Staff</option>
                        <option>Admin</option>
                      </Select>
                    </div>
                    <Button type="submit">Add</Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                      Cancel
                    </Button>
                  </form>
                </div>
              </Modal.Body>
            </Modal>
            <Button className="mb-5" onClick={() => setOpenModal(true)}>
              <span className="material-symbols-rounded -ml-1">add</span>
              Add User
            </Button>
            <Table striped hoverable>
              <Table.Head className="bg-slate-600">
                <Table.HeadCell>#</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Gender</Table.HeadCell>
                <Table.HeadCell>Role</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    1
                  </Table.Cell>
                  <Table.Cell>Jasper Macaraeg</Table.Cell>
                  <Table.Cell>jasper.macaraeg@gmail.com</Table.Cell>
                  <Table.Cell>Male</Table.Cell>
                  <Table.Cell>Admin</Table.Cell>
                  <Table.Cell>
                    <i>
                      <span className="material-symbols-rounded text-green-600 p-2">
                        edit
                      </span>
                    </i>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    2
                  </Table.Cell>
                  <Table.Cell>John Kenneth Adriano</Table.Cell>
                  <Table.Cell>johnk@gmail.com</Table.Cell>
                  <Table.Cell>Male</Table.Cell>
                  <Table.Cell>Staff</Table.Cell>
                  <Table.Cell>
                    <i>
                      <span className="material-symbols-rounded text-green-600 p-2">
                        edit
                      </span>
                    </i>
                    <i>
                      <span className="material-symbols-rounded text-red-600 p-2">
                        delete
                      </span>
                    </i>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    3
                  </Table.Cell>
                  <Table.Cell>Black</Table.Cell>
                  <Table.Cell>15</Table.Cell>
                  <Table.Cell>Active</Table.Cell>
                  <Table.Cell>Staff</Table.Cell>
                  <Table.Cell>
                    <i>
                      <span className="material-symbols-rounded text-green-600 p-2">
                        edit
                      </span>
                    </i>
                    <i>
                      <span className="material-symbols-rounded text-red-600 p-2">
                        delete
                      </span>
                    </i>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
