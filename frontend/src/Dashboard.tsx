import logo from "./assets/Revendo_logo.png";
import { Avatar, Dropdown, Navbar, Card } from "flowbite-react";
import "./css/index.css";

export default function Dashboard() {
  return (
    <div className="bg-[#1E1F22] h-full w-screen flex">
      <div className="fixed sidebar bg-[#35363D] text-white w-20 h-screen flex flex-col justify-center items-center">
        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            {/* White Rectacle Active */}
            <div className="vertical-rectangle absolute top-0 left-[-14px] w-2 h-10 bg-white rounded-lg"></div>
            home
          </span>
        </i>
        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-full mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2">
          <span className="material-symbols-rounded text-[#2B2D31] p-2 ">
            add
          </span>
        </i>
        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-full mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            person_add
          </span>
        </i>
        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-full mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            monitoring
          </span>
        </i>

        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-full mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            style
          </span>
        </i>
        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-full mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            ad_units
          </span>
        </i>
        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-full mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            manage_accounts
          </span>
        </i>
        <i className="icon my-4 text-2xl bg-[#FFFFFF] rounded-full mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            settings
          </span>
        </i>
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

        <div className="flex flex-col mt-24 ml-24">
          <div className="font-bold text-xl text-white ml-10">Dashboard</div>

          <main className="flex flex-1 flex-wrap ml-10">
            <Card className="bg-[#7289DA] mr-10 mt-10 h-96 md:w-1/4 mb-4 md:mb-0 md:mr-10">
              <h1 className="text-xl font-bold tracking-tight text-white text-center dark:text-dark">
                Unit 1
              </h1>
              <svg
                width="70"
                height="70"
                viewBox="0 0 94 136"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mb-4"
              >
                <path
                  d="M0.6875 0.609375V135.391H93.3125V0.609375H0.6875ZM6.03125 5.95312H68.375V106.297H6.03125V5.95312ZM73.125 10.7031H87.9688V30.2969H73.125V10.7031ZM78.4688 16.0469V24.9531H82.625V16.0469H78.4688ZM18.2031 18.125V24.9531H13.4531V30.2969H60.9531V24.9531H41.9531V15.75L37.2031 17.5312L35.4219 24.9531H27.7031V18.125H18.2031ZM75.7969 34.4531H85.2969V39.7969H75.7969V34.4531ZM49.0781 37.6594C47.475 37.6594 46.0797 38.55 45.2781 39.6484C44.4172 41.1031 43.9422 42.4984 44.0609 43.9531H13.4531V49.2969H60.9531V43.9531H54.0953C54.1844 42.4391 53.6203 40.6875 52.8781 39.6484C52.0766 38.55 50.6813 37.6594 49.0781 37.6594ZM75.7969 43.9531H85.2969V49.2969H75.7969V43.9531ZM18.2031 56.125V62.9531H13.4531V68.2969H60.9531V62.9531H53.8281V56.125H46.7031V62.9531H37.2031V53.75H32.4531V62.9531H22.9531V58.5L18.2031 56.125ZM20.5781 74.3531C18.7672 74.3531 17.3719 75.5109 16.6297 76.7281C15.6797 78.5391 15.4422 80.1422 15.5906 81.9531H13.4531V87.2969H60.9531V81.9531H41.9531V75.125H32.4531V81.9531H25.5656C25.7438 80.1719 25.3578 78.0938 24.5266 76.7281C23.7844 75.5109 22.3891 74.3531 20.5781 74.3531ZM75.7969 96.2031H85.2969V101.547H75.7969V96.2031ZM6.03125 111.641H68.375V130.047H6.03125V111.641ZM11.375 116.984V124.703H63.0312V116.984H11.375Z"
                  fill="white"
                />
              </svg>

              <div className="flex">
                <span className="material-symbols-rounded text-white ">
                  charging_station
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Battery Level:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  90%
                </h5>
              </div>

              <div className="flex">
                <span className="material-symbols-rounded text-white">
                  inventory_2
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Capacity Level:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  35%
                </h5>
              </div>

              <div className="flex">
                <span className="material-symbols-rounded text-white">
                  location_on
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Location:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  Caloocan
                </h5>
              </div>
            </Card>
            <Card className="bg-[#7289DA] mr-10 mt-10 h-96 md:w-1/4 mb-4 md:mb-0 md:mr-10">
              <h1 className="text-xl font-bold tracking-tight text-white text-center dark:text-dark">
                Unit 1
              </h1>
              <svg
                width="70"
                height="70"
                viewBox="0 0 94 136"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mb-4"
              >
                <path
                  d="M0.6875 0.609375V135.391H93.3125V0.609375H0.6875ZM6.03125 5.95312H68.375V106.297H6.03125V5.95312ZM73.125 10.7031H87.9688V30.2969H73.125V10.7031ZM78.4688 16.0469V24.9531H82.625V16.0469H78.4688ZM18.2031 18.125V24.9531H13.4531V30.2969H60.9531V24.9531H41.9531V15.75L37.2031 17.5312L35.4219 24.9531H27.7031V18.125H18.2031ZM75.7969 34.4531H85.2969V39.7969H75.7969V34.4531ZM49.0781 37.6594C47.475 37.6594 46.0797 38.55 45.2781 39.6484C44.4172 41.1031 43.9422 42.4984 44.0609 43.9531H13.4531V49.2969H60.9531V43.9531H54.0953C54.1844 42.4391 53.6203 40.6875 52.8781 39.6484C52.0766 38.55 50.6813 37.6594 49.0781 37.6594ZM75.7969 43.9531H85.2969V49.2969H75.7969V43.9531ZM18.2031 56.125V62.9531H13.4531V68.2969H60.9531V62.9531H53.8281V56.125H46.7031V62.9531H37.2031V53.75H32.4531V62.9531H22.9531V58.5L18.2031 56.125ZM20.5781 74.3531C18.7672 74.3531 17.3719 75.5109 16.6297 76.7281C15.6797 78.5391 15.4422 80.1422 15.5906 81.9531H13.4531V87.2969H60.9531V81.9531H41.9531V75.125H32.4531V81.9531H25.5656C25.7438 80.1719 25.3578 78.0938 24.5266 76.7281C23.7844 75.5109 22.3891 74.3531 20.5781 74.3531ZM75.7969 96.2031H85.2969V101.547H75.7969V96.2031ZM6.03125 111.641H68.375V130.047H6.03125V111.641ZM11.375 116.984V124.703H63.0312V116.984H11.375Z"
                  fill="white"
                />
              </svg>

              <div className="flex">
                <span className="material-symbols-rounded text-white ">
                  charging_station
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Battery Level:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  90%
                </h5>
              </div>

              <div className="flex">
                <span className="material-symbols-rounded text-white">
                  inventory_2
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Capacity Level:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  35%
                </h5>
              </div>

              <div className="flex">
                <span className="material-symbols-rounded text-white">
                  location_on
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Location:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  Caloocan
                </h5>
              </div>
            </Card>
            <Card className="bg-[#7289DA] mr-10 mt-10 h-96 md:w-1/4 mb-4 md:mb-0 md:mr-10">
              <h1 className="text-xl font-bold tracking-tight text-white text-center dark:text-dark">
                Unit 1
              </h1>
              <svg
                width="70"
                height="70"
                viewBox="0 0 94 136"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mb-4"
              >
                <path
                  d="M0.6875 0.609375V135.391H93.3125V0.609375H0.6875ZM6.03125 5.95312H68.375V106.297H6.03125V5.95312ZM73.125 10.7031H87.9688V30.2969H73.125V10.7031ZM78.4688 16.0469V24.9531H82.625V16.0469H78.4688ZM18.2031 18.125V24.9531H13.4531V30.2969H60.9531V24.9531H41.9531V15.75L37.2031 17.5312L35.4219 24.9531H27.7031V18.125H18.2031ZM75.7969 34.4531H85.2969V39.7969H75.7969V34.4531ZM49.0781 37.6594C47.475 37.6594 46.0797 38.55 45.2781 39.6484C44.4172 41.1031 43.9422 42.4984 44.0609 43.9531H13.4531V49.2969H60.9531V43.9531H54.0953C54.1844 42.4391 53.6203 40.6875 52.8781 39.6484C52.0766 38.55 50.6813 37.6594 49.0781 37.6594ZM75.7969 43.9531H85.2969V49.2969H75.7969V43.9531ZM18.2031 56.125V62.9531H13.4531V68.2969H60.9531V62.9531H53.8281V56.125H46.7031V62.9531H37.2031V53.75H32.4531V62.9531H22.9531V58.5L18.2031 56.125ZM20.5781 74.3531C18.7672 74.3531 17.3719 75.5109 16.6297 76.7281C15.6797 78.5391 15.4422 80.1422 15.5906 81.9531H13.4531V87.2969H60.9531V81.9531H41.9531V75.125H32.4531V81.9531H25.5656C25.7438 80.1719 25.3578 78.0938 24.5266 76.7281C23.7844 75.5109 22.3891 74.3531 20.5781 74.3531ZM75.7969 96.2031H85.2969V101.547H75.7969V96.2031ZM6.03125 111.641H68.375V130.047H6.03125V111.641ZM11.375 116.984V124.703H63.0312V116.984H11.375Z"
                  fill="white"
                />
              </svg>

              <div className="flex">
                <span className="material-symbols-rounded text-white ">
                  charging_station
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Battery Level:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  90%
                </h5>
              </div>

              <div className="flex">
                <span className="material-symbols-rounded text-white">
                  inventory_2
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Capacity Level:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  35%
                </h5>
              </div>

              <div className="flex">
                <span className="material-symbols-rounded text-white">
                  location_on
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Location:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  Caloocan
                </h5>
              </div>
            </Card>
            <Card className="bg-[#7289DA] mr-10 mt-10 h-96 md:w-1/4 mb-4 md:mb-0 md:mr-10">
              <h1 className="text-xl font-bold tracking-tight text-white text-center dark:text-dark">
                Unit 1
              </h1>
              <svg
                width="70"
                height="70"
                viewBox="0 0 94 136"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mb-4"
              >
                <path
                  d="M0.6875 0.609375V135.391H93.3125V0.609375H0.6875ZM6.03125 5.95312H68.375V106.297H6.03125V5.95312ZM73.125 10.7031H87.9688V30.2969H73.125V10.7031ZM78.4688 16.0469V24.9531H82.625V16.0469H78.4688ZM18.2031 18.125V24.9531H13.4531V30.2969H60.9531V24.9531H41.9531V15.75L37.2031 17.5312L35.4219 24.9531H27.7031V18.125H18.2031ZM75.7969 34.4531H85.2969V39.7969H75.7969V34.4531ZM49.0781 37.6594C47.475 37.6594 46.0797 38.55 45.2781 39.6484C44.4172 41.1031 43.9422 42.4984 44.0609 43.9531H13.4531V49.2969H60.9531V43.9531H54.0953C54.1844 42.4391 53.6203 40.6875 52.8781 39.6484C52.0766 38.55 50.6813 37.6594 49.0781 37.6594ZM75.7969 43.9531H85.2969V49.2969H75.7969V43.9531ZM18.2031 56.125V62.9531H13.4531V68.2969H60.9531V62.9531H53.8281V56.125H46.7031V62.9531H37.2031V53.75H32.4531V62.9531H22.9531V58.5L18.2031 56.125ZM20.5781 74.3531C18.7672 74.3531 17.3719 75.5109 16.6297 76.7281C15.6797 78.5391 15.4422 80.1422 15.5906 81.9531H13.4531V87.2969H60.9531V81.9531H41.9531V75.125H32.4531V81.9531H25.5656C25.7438 80.1719 25.3578 78.0938 24.5266 76.7281C23.7844 75.5109 22.3891 74.3531 20.5781 74.3531ZM75.7969 96.2031H85.2969V101.547H75.7969V96.2031ZM6.03125 111.641H68.375V130.047H6.03125V111.641ZM11.375 116.984V124.703H63.0312V116.984H11.375Z"
                  fill="white"
                />
              </svg>

              <div className="flex">
                <span className="material-symbols-rounded text-white ">
                  charging_station
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Battery Level:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  90%
                </h5>
              </div>

              <div className="flex">
                <span className="material-symbols-rounded text-white">
                  inventory_2
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Capacity Level:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  35%
                </h5>
              </div>

              <div className="flex">
                <span className="material-symbols-rounded text-white">
                  location_on
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Location:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  Caloocan
                </h5>
              </div>
            </Card>
            <Card className="bg-[#7289DA] mr-10 mt-10 h-96 md:w-1/4 mb-4 md:mb-0 md:mr-10">
              <h1 className="text-xl font-bold tracking-tight text-white text-center dark:text-dark">
                Unit 1
              </h1>
              <svg
                width="70"
                height="70"
                viewBox="0 0 94 136"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mb-4"
              >
                <path
                  d="M0.6875 0.609375V135.391H93.3125V0.609375H0.6875ZM6.03125 5.95312H68.375V106.297H6.03125V5.95312ZM73.125 10.7031H87.9688V30.2969H73.125V10.7031ZM78.4688 16.0469V24.9531H82.625V16.0469H78.4688ZM18.2031 18.125V24.9531H13.4531V30.2969H60.9531V24.9531H41.9531V15.75L37.2031 17.5312L35.4219 24.9531H27.7031V18.125H18.2031ZM75.7969 34.4531H85.2969V39.7969H75.7969V34.4531ZM49.0781 37.6594C47.475 37.6594 46.0797 38.55 45.2781 39.6484C44.4172 41.1031 43.9422 42.4984 44.0609 43.9531H13.4531V49.2969H60.9531V43.9531H54.0953C54.1844 42.4391 53.6203 40.6875 52.8781 39.6484C52.0766 38.55 50.6813 37.6594 49.0781 37.6594ZM75.7969 43.9531H85.2969V49.2969H75.7969V43.9531ZM18.2031 56.125V62.9531H13.4531V68.2969H60.9531V62.9531H53.8281V56.125H46.7031V62.9531H37.2031V53.75H32.4531V62.9531H22.9531V58.5L18.2031 56.125ZM20.5781 74.3531C18.7672 74.3531 17.3719 75.5109 16.6297 76.7281C15.6797 78.5391 15.4422 80.1422 15.5906 81.9531H13.4531V87.2969H60.9531V81.9531H41.9531V75.125H32.4531V81.9531H25.5656C25.7438 80.1719 25.3578 78.0938 24.5266 76.7281C23.7844 75.5109 22.3891 74.3531 20.5781 74.3531ZM75.7969 96.2031H85.2969V101.547H75.7969V96.2031ZM6.03125 111.641H68.375V130.047H6.03125V111.641ZM11.375 116.984V124.703H63.0312V116.984H11.375Z"
                  fill="white"
                />
              </svg>

              <div className="flex">
                <span className="material-symbols-rounded text-white ">
                  charging_station
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Battery Level:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  90%
                </h5>
              </div>

              <div className="flex">
                <span className="material-symbols-rounded text-white">
                  inventory_2
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Capacity Level:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  35%
                </h5>
              </div>

              <div className="flex">
                <span className="material-symbols-rounded text-white">
                  location_on
                </span>
                <h5 className="text-sm font-bold ml-1 tracking-tight text-white dark:text-dark">
                  Location:
                </h5>
                <h5 className="text-sm tracking-tight ml-1 text-white dark:text-dark">
                  Caloocan
                </h5>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
