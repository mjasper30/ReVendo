import logo from "./assets/Revendo_logo.png";
import { Avatar, Card, Dropdown, Navbar, Tooltip, Table } from "flowbite-react";
import "./css/index.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
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
                {/* White Rectacle Active */}
                <div className="vertical-rectangle absolute top-0 left-[-14px] w-2 h-10 bg-white rounded-lg"></div>
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
        <Navbar fluid className="fixed top-0 left-0 w-full z-50 bg-[#7289DA]">
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

        <div className="flex flex-col ml-24 mx-auto">
          <div className="font-bold text-xl text-white ml-10 my-10 z-100">
            Dashboard
          </div>
          <div className="flex items-center justify-between ml-10 mb-5 gap-4">
            <Card className="max-w-sm bg-green-500" horizontal>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <span className="material-symbols-rounded text-[#2B2D31] p-2">
                  manage_accounts
                </span>
                Registered RFID
              </h5>
              <p className="text-center font-normal text-xl text-gray-700 dark:text-gray-400">
                456
              </p>
            </Card>
            <Card className="max-w-sm bg-red-500" horizontal>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <span className="material-symbols-rounded text-[#2B2D31] p-2">
                  water_bottle
                </span>
                Plastic Bottles
              </h5>
              <p className="text-center font-normal text-xl text-gray-900 dark:text-gray-400">
                7489412
              </p>
            </Card>
            <Card className="max-w-sm bg-orange-500" horizontal>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <span className="material-symbols-rounded text-[#2B2D31] p-2">
                  inventory_2
                </span>
                Capacity Status
              </h5>
              <p className="text-center font-normal text-xl text-gray-700 dark:text-gray-400">
                Not full
              </p>
            </Card>
            <Card className="max-w-sm bg-violet-500" horizontal>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <span className="material-symbols-rounded text-[#2B2D31] p-2">
                  battery_charging_full
                </span>
                Battery Status
              </h5>
              <p className="text-center font-normal text-xl text-gray-700 dark:text-gray-400">
                56%
              </p>
            </Card>
          </div>
          <div className="flex ml-10 mb-5 gap-4">
            <Table className="text-center" striped hoverable>
              <Table.Head className="bg-slate-600">
                <Table.HeadCell>#</Table.HeadCell>
                <Table.HeadCell>RFID Number</Table.HeadCell>
                <Table.HeadCell>Points</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    1
                  </Table.Cell>
                  <Table.Cell>33a537c2</Table.Cell>
                  <Table.Cell>45</Table.Cell>
                  <Table.Cell>Active</Table.Cell>
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
                    2
                  </Table.Cell>
                  <Table.Cell>737832c2</Table.Cell>
                  <Table.Cell>23</Table.Cell>
                  <Table.Cell>Active</Table.Cell>
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
                  <Table.Cell>e3153ec2</Table.Cell>
                  <Table.Cell>15</Table.Cell>
                  <Table.Cell>Active</Table.Cell>
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
            <Table striped hoverable className="text-center">
              <Table.Head className="bg-slate-600">
                <Table.HeadCell>Unit Number</Table.HeadCell>
                <Table.HeadCell>Capacity</Table.HeadCell>
                <Table.HeadCell>Location</Table.HeadCell>
                <Table.HeadCell>Battery</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    1
                  </Table.Cell>
                  <Table.Cell>Full</Table.Cell>
                  <Table.Cell>Caloocan</Table.Cell>
                  <Table.Cell>100%</Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    2
                  </Table.Cell>
                  <Table.Cell>Not Full</Table.Cell>
                  <Table.Cell>Malabon</Table.Cell>
                  <Table.Cell>50%</Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    3
                  </Table.Cell>
                  <Table.Cell>Full</Table.Cell>
                  <Table.Cell>Navotas</Table.Cell>
                  <Table.Cell>60%</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
