import { useEffect, useState } from "react";
import "./css/home.css";
import Loader from "./Loader";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showNavbar, setShowNavbar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  useEffect(() => {
    const fakeDataFetch = () => {
      setTimeout(() => {
        setIsLoading(false);
        // Set showNavbar to true with a delay of 500ms
        setTimeout(() => {
          setShowNavbar(true);
        }, 50);
      }, 4000);
    };
    fakeDataFetch();
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="bg-[#1E1F22] fixed inset-0 bg-cover bg-center scrollable-container">
      <nav
        className={`bg-[#5865F2] fixed top-0 w-full h-[85px] shadow-lg rounded-b-3xl z-10 ${
          showNavbar ? "slideDown" : "hidden-nav"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between mx-auto p-4 mt-1">
          <a href="#" className="flex items-center">
            <img
              src="/src/assets/Revendo-icon.png"
              className="h-auto w-auto max-h-[56px] max-w-[56px] pr-2"
            />
            <span className="self-center text-3xl font-semibold whitespace-nowrap text-[#]dark:text-white">
              ReVendo
            </span>
          </a>
          <button
            onClick={toggleDropdown}
            className="inline-flex items-center w-10 h-10 justify-center text-sm text-white rounded-xl burger:hidden hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-red dark:text-white dark:hover:bg-discord"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className={`${
              showDropdown ? "block" : "hidden"
            } w-full burger:block burger:w-auto`}
            id="navbar-dropdown"
          >
            <ul className="flex flex-col font-medium mt-4  rounded-lg bg-gray-50 burger:flex-row burger:space-x-8  burger:mt-0 burger:border-0 burger:bg-transparent dark:bg-gray-800 burger:dark:bg-transparent dark:border-gray-700">
              <li>
                <a
                  href="#team"
                  className="block py-2 pl-3 pr-4 text-white  font-extrabold"
                >
                  Meet the team
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="block py-2 pl-3 pr-4 text-white font-extrabold"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="block py-2 pl-3 pr-4 text-white font-extrabold"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#home"
                  className="block py-2 pl-3 pr-4 text-white font-extrabold"
                >
                  Home
                </a>
              </li>
              <li className="hidden burger:block">
                <button
                  type="button"
                  className="text-black bg-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm pl-2.5 py-2 text-center mr-3 burger:mr-1 flex items-center w-40"
                >
                  <img
                    src="/src/assets/dlbtn.ico"
                    alt=""
                    className="mr-2 w-6 h-6"
                  />
                  <span className="flex-shrink-0 ">Download App</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="flex flex-col justify-start items-center">
        <div className="tabletH:pt-[100px] pt-[100x] laptop::pt-0">
          <Section id="home" className="items-center">
            <VerticalColumns>
              <HorizontalColumns>
                <Column className="text-center flex flex-col justify-center">
                  <Box className="text-7xl text-white NotoSansJP font-semibold pb-10 text-center  laptop:text-left ">
                    ReVendo
                  </Box>
                  <Box className="text-2xl text-white text-justify font-bold leading-10 font-outline-2 tracking-3 py-10   laptop:text-left">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nulla quam velit, vulputate eu pharetra nec, mattis ac
                    neque.Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac
                    neque.Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac
                    neque.
                  </Box>
                  <VerticalColumns className="">
                    <HorizontalColumns className="md:flex-row items-center py-10 text-center">
                      <Column>
                        <Box className="rounded-3xl bg-discord border-discord border-4 py-5 w-72 text-center text-white font-black hover:bg-white hover:text-discord hover:border-none">
                          GET STARTED
                        </Box>
                      </Column>
                      <Column>
                        <Box className="rounded-3xl bg-discord border-discord border-4 py-5 w-72 text-center text-white font-black hover:bg-white hover:text-discord hover:border-none">
                          LEARN MORE
                        </Box>
                      </Column>
                    </HorizontalColumns>
                  </VerticalColumns>
                </Column>
                <Column className="flex items-center justify-center">
                  <Box>
                    <img
                      className="border-[13px] rounded-[85px] border-discord max-w-full max-h-[1200px]  imgH:max-w-[600px]  imgH:max-h-[700px]"
                      src="src\assets\Untitled-3.webp"
                    />
                  </Box>
                </Column>
              </HorizontalColumns>
            </VerticalColumns>
          </Section>

          <Section id="about" className="align-top mt-5">
            <VerticalColumns>
              <HorizontalColumns>
                <Column className="bg-white border-[9px] h-[400px]  rounded-[85px] border-discord text-center flex flex-col p-6 mx-2 px-5  items-center m:w-1/2">
                  <img
                    className="w-[123px] h-[118px]"
                    src="/src/assets/checkico.png"
                    alt=""
                  />
                  <Box className="NotoSansJP font-black text-discord text-[36px] py-3">
                    Feature One
                  </Box>
                  <Box className=" NotoSansJP font-black text-discord text-[20px] leading-[30px]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                    quis felis convallis, rhoncus leo id, scelerisque purus. Ut
                    auctor gravida nulla.
                  </Box>
                </Column>
                <Column className="bg-white border-[9px] h-[400px]  rounded-[85px] border-discord text-center flex flex-col p-6 mx-2 px-5   items-center m:w-1/2">
                  <img
                    className="w-[123px] h-[118px]"
                    src="/src/assets/flagico.png"
                    alt=""
                  />
                  <Box className="NotoSansJP font-black text-discord text-[36px] py-3">
                    Feature Two
                  </Box>
                  <Box className=" NotoSansJP font-black text-discord text-[20px] leading-[30px]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                    quis felis convallis, rhoncus leo id, scelerisque purus. Ut
                    auctor gravida nulla.
                  </Box>
                </Column>
                <Column className="bg-white border-[9px] h-[400px]  rounded-[85px] border-discord text-center flex flex-col p-6 mx-5 px-5  items-center m:w-1/2">
                  <img
                    className="w-[123px] h-[118px]"
                    src="/src/assets/starico.png"
                    alt=""
                  />
                  <Box className="NotoSansJP font-black text-discord text-[36px] py-3">
                    Feature Three
                  </Box>
                  <Box className=" NotoSansJP font-black text-discord text-[20px] leading-[30px]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                    quis felis convallis, rhoncus leo id, scelerisque purus. Ut
                    auctor gravida nulla.
                  </Box>
                </Column>
              </HorizontalColumns>
              <HorizontalColumns>
                <Column className="imgH:bg-white imgH:border-[9px] imgH:h-[400px]  imgH:rounded-[85px] imgH:border-discord imgH:flex imgH:mx-5 hidden ">
                  <div className="flex">
                    <Column className="text-center w-2/3 rounded-[85px] mx-16 my-5 overflow-hidden">
                      <Box className="mt-2 NotoSansJP font-black text-black text-[36px] py-3 text-left bigH:py-5 bigH:mt-5 ">
                        Heading explaining the main benefit of ReVendo
                      </Box>
                      <Box className="NotoSansJP font-black text-discord text-[20px] leading-[30px] text-left pt-3 bigH:pt-5">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatiis.
                      </Box>
                      <br></br>
                      <Box className="NotoSansJP font-black text-discord text-[20px] leading-[30px] text-left">
                        Ut auctor gravida nulla. Nam id erat elementum, accumsan
                        dui non, porttitor lorem.
                      </Box>
                    </Column>

                    <Column className="w-1/2 flex justify-end overflow-hidden">
                      <img
                        className="rounded-r-[76px] bigH:w-[570px]"
                        src="src\assets\Untitled-4.webp"
                        alt=""
                      />
                    </Column>
                  </div>
                </Column>
              </HorizontalColumns>
            </VerticalColumns>
          </Section>

          <Section id="blog">
            <VerticalColumns>
              <Column>
                <Box className="text-4xl text-white NotoSansJP font-semibold pb-10 text-center">
                  TEXTTEXTTEXT
                </Box>
              </Column>
              <Column>
                <Box className="text-2xl text-white font-bold leading-10 font-outline-2 tracking-3  text-center max-w-[1250px]">
                  Nam libero tempore, cum soluta nobis est eligendi optio cumque
                  nihil impedit quo minus id quod maxime placeat facere
                  possimus, omnis voluptas assumenda est, omnis dolor
                  repellendus.
                </Box>
              </Column>
              <HorizontalColumns>
                <div className="laptop:flex laptop:justify-between">
                  <Column className="m:w-[50%] mx-5 py-2">
                    <img
                      className="bg-white border-[9px] h-[450px]  rounded-[85px] border-discord text-center flex flex-col    items-center  m:w-100%"
                      src="src\assets\Untitled-1.webp"
                      alt=""
                    />
                  </Column>
                  <Column className="m:w-[50%] mx-5 py-2">
                    <img
                      className="bg-white border-[9px] h-[450px]  rounded-[85px] border-discord text-center flex flex-col    items-center  m:w-100%"
                      src="src\assets\Untitled-1.webp"
                      alt=""
                    />
                  </Column>
                  <Column className="m:w-[50%] mx-5 py-2">
                    <img
                      className="bg-white border-[9px] h-[450px]  rounded-[85px] border-discord text-center flex flex-col     items-center  m:w-100%"
                      src="src\assets\Untitled-1.webp"
                      alt=""
                    />
                  </Column>
                </div>
              </HorizontalColumns>
              <Column>
                <Box>
                  <img className="mx-auto" src="/src/assets/dlimg.png" alt="" />
                </Box>
              </Column>
            </VerticalColumns>
          </Section>

          <Section id="team">
            <VerticalColumns>
              <HorizontalColumns className="grid grid-cols-4 gap-4">
                <Column className="flex justify-center ">
                  <Box className="border border-white p-4 text-center">
                    Andriel Geomer . Gabriel
                  </Box>
                </Column>
              </HorizontalColumns>
              <HorizontalColumns className="grid grid-cols-4 gap-4">
                <Column className="flex justify-center">
                  <Box className="border border-white p-4 text-center">
                    Daniel Custodio{" "}
                  </Box>
                </Column>
              </HorizontalColumns>
              <HorizontalColumns className="grid grid-cols-4 gap-4">
                <Column className="flex justify-center">
                  <Box className="border border-white p-4 text-center">
                    John Kenneth Adriano
                  </Box>
                </Column>
              </HorizontalColumns>
              <HorizontalColumns className="grid grid-cols-4 gap-4">
                <Column className="flex justify-center">
                  <Box className="border border-white p-4 text-center">
                    May Pearl Rivera
                  </Box>
                </Column>
              </HorizontalColumns>
            </VerticalColumns>
            <VerticalColumns>
              <HorizontalColumns className="grid grid-cols-4 gap-4">
                <Column className="flex justify-center">
                  <Box className="border border-white p-4 text-center">
                    Jasper Macaraeg
                  </Box>
                </Column>
              </HorizontalColumns>
              <HorizontalColumns className="grid grid-cols-4 gap-4">
                <Column className="flex justify-center">
                  <Box className="border border-white p-4 text-center">
                    Daniel Sigue
                  </Box>
                </Column>
              </HorizontalColumns>
              <HorizontalColumns className="grid grid-cols-4 gap-4">
                <Column className="flex justify-center">
                  <Box className="border border-white p-4 text-center">
                    John Maverick Clemente
                  </Box>
                </Column>
              </HorizontalColumns>
              <HorizontalColumns className="grid grid-cols-4 gap-4">
                <Column className="flex justify-center">
                  <Box className="border border-white p-4 text-center">
                    Ma Loelaida Clave
                  </Box>
                </Column>
              </HorizontalColumns>
            </VerticalColumns>
          </Section>
        </div>
      </div>
    </div>
  );
}
type CommonProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

// FIRST DIV
const Section = ({ children, className, id }: CommonProps) => (
  <div
    className={
      "relative min-h-[100vh] flex justify-center p-5 tabletH:mx-15 laptopH:mx-20 " +
      className
    }
    id={id}
  >
    {children}
  </div>
);

//Second Div  CONTROL BELOW
const VerticalColumns = ({ children, className }: CommonProps) => (
  <div className={"flex flex-col gap-4 items-center " + className}>
    {children}
  </div>
);

// Third Div  CONTROL ALL COLUMN/BOX DIV
const HorizontalColumns = ({ children, className }: CommonProps) => (
  <div className={"flex flex-col imgH:flex-row gap-4 " + className}>
    {children}
  </div>
);

//Fourth Div FOR CONTROL UNDER BOX DIV

const Column = ({ children, className }: CommonProps) => (
  <div className={" " + className}>{children}</div>
);

//Fifth Div
const Box = ({ children, className }: CommonProps) => (
  <div className={" " + className}>{children}</div>
);
