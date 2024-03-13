"use client";

import { Accordion, Label, TextInput, Button } from "flowbite-react";
import "animate.css";
import { useEffect, useState } from "react";
import "./home.css";
import adriano from "./assets/adriano.png";
import clemente from "./assets/clemente.jpg";
import clave from "./assets/clave.jpg";
import custodio from "./assets/custodio.png";
import sigue from "./assets/sigue.png";
import rivera from "./assets/rivera.jpg";
import gabriel from "./assets/gabriel.png";
import macaraeg from "./assets/macaraeg.jpg";
import navbar_logo from "./assets/Revendo-icon.png";
import download_app_icon from "./assets/dlbtn.ico";
import image_revendo from "./assets/Untitled-3.webp";
import image_revendo_1 from "./assets/Untitled-4.webp";
import insert from "./assets/insert.png";
import observe from "./assets/observe.png";
import claim from "./assets/claim.png";
import rfid from "./assets/rfid.png";
import qr from "./assets/qr.png";
import Loader from "./loader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showNavbar, setShowNavbar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [points, setPoints] = useState<number | null>(null);
  const [rfidNumber, setRfidNumber] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  // Assuming you have a function to handle button click
  const handleCheckBalance = async () => {
    try {
      const response = await fetch(
        "https://revendo-backend-main.onrender.com/check_balance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rfid: rfidNumber }),
        }
      );

      if (response.ok) {
        const fetchedPoints = await response.json();
        setPoints(fetchedPoints);
        setErrorMessage(null); // Reset error message if it was previously set
      } else if (response.status === 404) {
        setPoints(null);
        setErrorMessage("RFID not found");
      } else {
        const error = await response.json();
        console.error("Error checking balance:", error);
        setErrorMessage("Error checking balance");
      }
    } catch (error) {
      console.error("Error checking balance:", error);
      setErrorMessage("Error checking balance");
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      console.log(entry);
      if (entry.isIntersecting) {
        entry.target.classList.add("showY");
      }
    });
  });

  const hiddenElements = document.querySelectorAll(".hideY");
  hiddenElements.forEach((el) => observer.observe(el));

  const observer2 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      console.log(entry);
      if (entry.isIntersecting) {
        entry.target.classList.add("showX");
      }
    });
  });

  const hiddenElements2 = document.querySelectorAll(".hideX");
  hiddenElements2.forEach((el) => observer2.observe(el));

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
      {/* Navigation Bar */}
      <nav
        className={`bg-[#5865F2] fixed top-0 w-full h-[85px] sm:h-[60px] shadow-lg b-3xl z-10 ${
          showNavbar ? "slideDown" : "hidden-nav"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between mx-auto p-4 mt-1">
          <a href="#" className="flex items-center">
            <img
              src={navbar_logo}
              className="h-auto w-auto max-h-[56px] max-w-[56px] sm:max-h-[20px] pr-2"
            />
            <span className="self-center text-3xl font-semibold whitespace-nowrap text-white sm:text-sm dark:text-white">
              ReVendo
            </span>
          </a>
          <button
            onClick={toggleDropdown}
            className="inline-flex items-center w-10 h-10 justify-center text-sm text-white rounded-xl sm:w-5 sm:h-5 burger:hidden hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-red dark:text-white dark:hover:bg-discord transition-all duration-300"
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
                strokeWidth="2"
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
            <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-500 burger:flex-row burger:space-x-8  burger:mt-0 burger:border-0 burger:bg-transparent dark:bg-gray-800 burger:dark:bg-transparent dark:border-gray-700">
              <li>
                <a
                  href="#home"
                  className="block py-2 pl-3 pr-4 text-white font-extrabold group relative"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transition-transform transform scale-x-0 group-hover:scale-x-100"></span>
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="block py-2 pl-3 pr-4 text-white font-extrabold group relative"
                >
                  About
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transition-transform transform scale-x-0 group-hover:scale-x-100"></span>
                </a>
              </li>
              <li>
                <a
                  href="#team"
                  className="block py-2 pl-3 pr-4 text-white font-extrabold group relative"
                >
                  Meet the team
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transition-transform transform scale-x-0 group-hover:scale-x-100"></span>
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="block py-2 pl-3 pr-4 text-white font-extrabold group relative"
                >
                  FAQ
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transition-transform transform scale-x-0 group-hover:scale-x-100"></span>
                </a>
              </li>
              <li>
                <a
                  href="#contact_us"
                  className="block py-2 pl-3 pr-4 text-white font-extrabold group relative"
                >
                  Contact Us
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transition-transform transform scale-x-0 group-hover:scale-x-100"></span>
                </a>
              </li>
              <li className="hidden burger:block">
                <a
                  href="/RevendoApp.APK"
                  download="RevendoApp.apk"
                  className="text-black bg-white hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm pl-2.5 py-2 text-center mr-3 burger:mr-1 flex items-center w-40 transition-all duration-300"
                >
                  <img
                    src={download_app_icon}
                    alt=""
                    className="mr-2 w-6 h-6"
                  />
                  <span className="flex-shrink-0">Download App</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* End of Navigation Bar */}

      <div className="flex flex-col justify-start items-center">
        <div className="tabletH:pt-[50px] pt-[10px] laptop::pt-0">
          {/* Home Section */}
          <Section id="home" className="items-center">
            <VerticalColumns>
              <HorizontalColumns>
                <Column className="text-center flex flex-col justify-center">
                  <Box className="animate__animated animate__fadeInLeft text-xl text-white NotoSansJP font-semibold pb-5 text-center laptop:text-left sm:text-4xl sm:mt-14 md:text-5xl lg:text-6xl xl:text-7xl">
                    ReVendo
                  </Box>
                  <Box className="animate__animated animate__fadeInLeft text-sm sm:text-sm sm:mx-1 md:text-sm lg:text-sm xl:text-4xl text-white text-center font-bold leading-10 font-outline-2 tracking-3 py-5 sm:pr-4 laptop:pr-40 laptop:text-left">
                    Introducing the EcoRewards Reverse Vending Machine:
                    Revolutionizing the fight against plastic bottle pollution!
                  </Box>
                  <VerticalColumns>
                    <HorizontalColumns className="md:flex-row items-center py-2 text-center">
                      <div className="flex gap-4">
                        <Column>
                          <a href="#get_started">
                            <Box className="animate__animated animate__zoomIn rounded-3xl bg-discord border-discord border-3 py-5 w-64 text-center text-white font-black sm:w-[120px] sm:text-[9px] sm:border-1 hover:bg-white hover:text-discord hover:border-none transition-all duration-300">
                              GET STARTED
                            </Box>
                          </a>
                        </Column>
                        <Column>
                          <a href="#check_balance">
                            <Box className="animate__animated animate__zoomIn rounded-3xl bg-discord border-discord border-3 py-5 w-64 text-center text-white font-black sm:w-[120px] sm:text-[9px] sm:border-1 hover:bg-white hover:text-discord hover:border-none transition-all duration-300">
                              CHECK BALANCE
                            </Box>
                          </a>
                        </Column>
                      </div>
                    </HorizontalColumns>
                  </VerticalColumns>
                </Column>
                <Column className="flex items-center justify-center">
                  <Box>
                    <img
                      className="animate__animated animate__fadeInRight border-[13px] rounded-[100px] border-discord max-w-full max-h-[1200px]  imgH:max-w-[500px] imgH:max-h-[600px] sm:max-h-[200px] sm:border-[10px] sm:rounded-[20px]"
                      src={image_revendo}
                    />
                  </Box>
                </Column>
              </HorizontalColumns>
            </VerticalColumns>
          </Section>
          {/* End of Home Section */}

          {/* About Section */}
          <Section id="about" className="align-top mt-20 sm:mt-2">
            <VerticalColumns>
              <div className="hideY">
                <HorizontalColumns>
                  <Column className="imgH:bg-white imgH:border-[9px] imgH:h-[450px]  imgH:rounded-[30px] imgH:border-discord imgH:flex imgH:mx-5 sm:mx-auto sm:w-[90%] sm:h-[640px] sm:bg-white sm:border-[9px] sm:rounded-[30px] sm:text-center sm:border-discord">
                    <div className="flex sm:flex-col">
                      <Column className="text-center w-2/3 mx-16 my-5 overflow-hidden sm:mx-auto">
                        <Box className="mt-2 NotoSansJP font-black text-black text-[48px] py-3 text-left bigH:py-5 bigH:mt-5 sm:text-center sm:text-[30px]">
                          What is ReVendo?
                        </Box>
                        <Box className="NotoSansJP font-black text-discord text-[20px] leading-[30px] text-left pt-3 bigH:pt-5 sm:text-center sm:text-[10px] sm:leading-[20px]">
                          A Reverse Vending Machine that solves problem for
                          plastic bottle pollution that exchange plastic bottles
                          into reward points that will help community to reduce
                          plastic bottle waste and promote eco-friendly machine
                          that can exchange into RFID reward points into
                          charging station to accumulate time charging for smart
                          phones empowered by solar panel in the charging
                          station.
                        </Box>
                      </Column>

                      <Column className="w-1/2 flex justify-end overflow-hidden sm:w-full">
                        <img
                          className="rounded-r-[20px] bigH:w-[500px] sm:rounded-[20px]"
                          src={image_revendo_1}
                          alt=""
                        />
                      </Column>
                    </div>
                  </Column>
                </HorizontalColumns>
              </div>

              <div className="hideY">
                <HorizontalColumns>
                  <h2
                    id="get_started"
                    className="text-center text-5xl font-bold text-white my-11 sm:text-2xl sm:mt-16"
                  >
                    How does it work?
                  </h2>
                </HorizontalColumns>
                <Column>
                  <Box className="text-2xl text-white leading-10 font-outline-2 tracking-3  text-center max-w-[1250px] mb-11 sm:text-sm sm:mx-7">
                    This guide provides a detailed, step-by-step process for
                    converting plastic bottles into points that are then stored
                    in an RFID system.
                  </Box>
                </Column>
              </div>

              <div className="steps">
                <HorizontalColumns>
                  <Column className="steps hideY bg-white border-[9px] h-[350px] rounded-[30px] border-discord text-center flex flex-col p-6 mx-2 px-5 items-center m:w-1/2 sm:w-[85%] sm:mx-auto w-[50%] transition-all duration-200 hover:border-blue-600">
                    <img className="w-[70px] h-[70px]" src={rfid} alt="" />
                    <Box className="NotoSansJP font-black text-discord text-[20px] py-3">
                      Step One
                    </Box>
                    <Box className=" NotoSansJP text-discord text-[15px] leading-[30px]">
                      Tap your RFID card on the scanner to begin. Place your
                      plastic bottle inside the machine
                    </Box>
                  </Column>

                  <Column className="steps hideY bg-white border-[9px] h-[350px] rounded-[30px] border-discord text-center flex flex-col p-6 mx-2 px-5 items-center m:w-1/2 sm:w-[85%] sm:mx-auto w-[50%] transition-all duration-200 hover:border-blue-600">
                    <img className="w-[70px] h-[70px]" src={insert} alt="" />
                    <Box className="NotoSansJP font-black text-discord text-[20px] py-3">
                      Step Two
                    </Box>
                    <Box className="NotoSansJP text-discord text-[15px] leading-[30px]">
                      Insert your plastic bottle into the designated slot on the
                      machine.
                    </Box>
                  </Column>

                  <Column className="steps hideY bg-white border-[9px] h-[350px] rounded-[30px] border-discord text-center flex flex-col p-6 mx-2 px-5 items-center m:w-1/2 sm:w-[85%] sm:mx-auto w-[50%] transition-all duration-200 hover:border-blue-600">
                    <img className="w-[70px] h-[70px]" src={observe} alt="" />
                    <Box className="NotoSansJP font-black text-discord text-[20px] py-3">
                      Step Three
                    </Box>
                    <Box className=" NotoSansJP text-discord text-[15px] leading-[30px]">
                      Observe your point status on the display screen in
                      real-time as you deposit your plastic bottles.
                    </Box>
                  </Column>

                  <Column className="steps hideY bg-white border-[9px] h-[350px] rounded-[30px] border-discord text-center flex flex-col p-6 mx-2 px-5 items-center m:w-1/2 sm:w-[85%] sm:mx-auto w-[50%] transition-all duration-200 hover:border-blue-600">
                    <img className="w-[70px] h-[70px]" src={claim} alt="" />
                    <Box className="NotoSansJP font-black text-discord text-[20px] py-3">
                      Step Four
                    </Box>
                    <Box className=" NotoSansJP text-discord text-[15px] leading-[30px]">
                      Upon completion, tap the "Claim Points" button to redeem
                      your reward points.
                    </Box>
                  </Column>
                </HorizontalColumns>
              </div>

              <HorizontalColumns>
                <Box className="hideY text-2xl text-white leading-10 font-outline-2 mt-10 tracking-3 text-center max-w-[1250px] sm:text-sm sm:mx-7">
                  Exchange your plastic bottles for a cleaner planet and earn
                  valuable reward points with our state-of-the-art Reverse
                  Vending Machine. Take a step towards sustainability and
                  support your community by swapping plastic waste for
                  EcoRewards. But that's not all – the positive impact doesn't
                  stop there!
                  <br></br>
                  <br></br>
                  Your collected reward points can be seamlessly converted into
                  RFID credits, unlocking access to our innovative solar-powered
                  charging stations. Charge your smart devices using clean,
                  renewable energy while contributing to the reduction of
                  plastic waste. Join us in building a greener future, one
                  bottle at a time. Be a part of the change with EcoRewards!
                  🌞🔋 #EcoRewards #SustainableLiving #PlasticFreeFuture
                </Box>
              </HorizontalColumns>
            </VerticalColumns>
          </Section>

          {/*  */}
          <Section className="hideY align-top flex flex-col items-center">
            <h2
              id="check_balance"
              className="text-5xl font-bold text-center text-white my-11 sm:text-2xl"
            >
              How to check my balance?
            </h2>

            <Box className="text-2xl text-white leading-10 font-outline-2 mt-10 tracking-3 text-center max-w-[1250px] sm:text-sm sm:mx-12">
              Option 1: You can download our ReVendo app to check your balance.
            </Box>
            <img
              src={qr}
              className="h-auto w-auto max-h-[250px] max-w-[250px] sm:max-h-[150px] sm:max-w-[150px] mt-4 pr-2"
            />

            <Box className="text-2xl text-white leading-10 font-outline-2 mt-10 tracking-3 text-center max-w-[1250px] sm:text-sm sm:mx-12">
              Option 2: You can also check your balance by typing your RFID
              number below.
            </Box>
            <div className="flex flex-col sm:flex-row max-w-md gap-4 mt-10 sm:mt-10 sm:h-[50px]">
              <div className="mb-2 block">
                <Label htmlFor="base" />
              </div>
              <TextInput
                id="base"
                type="text"
                sizing="base"
                value={rfidNumber}
                onChange={(e) => setRfidNumber(e.target.value)}
                placeholder="RFID Number"
                className="w-full sm:w-auto text-sm sm:text-base"
              />

              <Button
                onClick={handleCheckBalance}
                color="blue"
                className="w-full sm:w-auto"
              >
                Check Balance
              </Button>
            </div>
            <div
              id="pointsDisplay"
              className={`mt-4 text-xl text-white ${
                errorMessage ? "bg-red-600" : "bg-green-600"
              } px-5 py-2 rounded-full leading-10 font-outline-2 tracking-3 text-center sm:text-base`}
            >
              {errorMessage ? (
                <span
                  style={{
                    color: "white",
                    borderRadius: "0.5rem",
                    lineHeight: "2.5rem",
                  }}
                >
                  {errorMessage}
                </span>
              ) : (
                points !== null && `Your balance: ${points} pts`
              )}
            </div>
            <Box className="text-2xl text-white leading-10 font-outline-2 mt-10 tracking-3 text-center max-w-[1250px] sm:text-sm sm:mx-12">
              Option 3: You can also check your balance by tapping your ReVendo
              Card in the machine. The machine will display your balance on the
              screen.
            </Box>
          </Section>

          {/* End About Section */}

          {/* Meet the Team Section */}
          <div className="teamcard">
            <Section id="team" className="align-top mt-20">
              <VerticalColumns>
                <h2 className="text-5xl font-bold text-center text-white mb-6 sm:text-2xl">
                  Meet the Team
                </h2>
                <HorizontalColumns className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-8">
                  <Column className="teamcard hideX flex flex-col items-center">
                    <Box className="bg-white p-6 rounded-lg shadow-md text-center h-full w-64 flex flex-col items-center justify-center">
                      <img
                        src={gabriel}
                        alt="Team Member 1"
                        className="w-32 h-32 rounded-full mb-4"
                      />
                      <h3 className="text-lg font-bold">
                        Andriel Geomer Gabriel
                      </h3>
                      <p className="text-gray-500">
                        Frontend/Backend Developer
                      </p>
                      <div className="flex space-x-4 mt-3">
                        <a
                          href={"https://www.facebook.com/Gravitationall.pull"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-facebook"></i>
                        </a>
                        <a
                          href={"https://github.com/J-i-w-o-o"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-github"></i>
                        </a>
                      </div>
                    </Box>
                  </Column>

                  <Column className="tramcard hideX flex flex-col items-center">
                    <Box className="bg-white p-6 rounded-lg shadow-md text-center h-full w-64 flex flex-col items-center justify-center">
                      <img
                        src={macaraeg}
                        alt="Team Member 1"
                        className="w-32 h-32 rounded-full mb-4"
                      />
                      <h3 className="text-lg font-bold">Jasper Macaraeg</h3>
                      <p className="text-gray-500">
                        Frontend/Backend Developer
                      </p>
                      <div className="flex space-x-4 mt-3">
                        <a
                          href={"https://www.facebook.com/mjasper30"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-facebook"></i>
                        </a>
                        <a
                          href={"https://github.com/mjasper30"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-github"></i>
                        </a>
                      </div>
                    </Box>
                  </Column>

                  <Column className="teamcard hideX flex flex-col items-center">
                    <Box className="bg-white p-6 rounded-lg shadow-md text-center h-full w-64 flex flex-col items-center justify-center">
                      <img
                        src={sigue}
                        alt="Team Member 1"
                        className="w-32 h-32 rounded-full mb-4"
                      />
                      <h3 className="text-lg font-bold">Daniel Sigue</h3>
                      <p className="text-gray-500">
                        Backend/Hardware Developer
                      </p>
                      <div className="flex space-x-4 mt-3">
                        <a
                          href={"https://www.facebook.com/daniel.sigue"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-facebook"></i>
                        </a>
                        <a
                          href={"https://github.com/dnlsigue"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-github"></i>
                        </a>
                      </div>
                    </Box>
                  </Column>

                  <Column className="teamcard hideX flex flex-col items-center">
                    <Box className="bg-white p-6 rounded-lg shadow-md text-center h-full w-64 flex flex-col items-center justify-center">
                      <img
                        src={custodio}
                        alt="Team Member 1"
                        className="w-32 h-32 rounded-full mb-4"
                      />
                      <h3 className="text-lg font-bold">Daniel Custodio</h3>
                      <p className="text-gray-500">Hardware Developer</p>
                      <div className="flex space-x-4 mt-3">
                        <a
                          href={"https://www.facebook.com/dnlcstd"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-facebook"></i>
                        </a>
                        <a href={""} target="_blank" rel="noopener noreferrer">
                          <i className="text-3xl fa-brands fa-github"></i>
                        </a>
                      </div>
                    </Box>
                  </Column>

                  <Column className="teamcard hideX flex flex-col items-center">
                    <Box className="bg-white p-6 rounded-lg shadow-md text-center h-full w-64 flex flex-col items-center justify-center">
                      <img
                        src={clemente}
                        alt="Team Member 1"
                        className="w-32 h-32 rounded-full mb-4"
                      />
                      <h3 className="text-lg font-bold">
                        John Maverick Clemente
                      </h3>
                      <p className="text-gray-500">Frontend Developer</p>
                      <div className="flex space-x-4 mt-3">
                        <a
                          href={"https://www.facebook.com/maestromav"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-facebook"></i>
                        </a>
                        <a
                          href={"https://github.com/MaestroMavs"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-github"></i>
                        </a>
                      </div>
                    </Box>
                  </Column>

                  <Column className="teamcard hideX flex flex-col items-center">
                    <Box className="bg-white p-6 rounded-lg shadow-md text-center h-full w-64 flex flex-col items-center justify-center">
                      <img
                        src={adriano}
                        alt="Team Member 1"
                        className="w-32 h-32 rounded-full mb-4"
                      />
                      <h3 className="text-lg font-bold">
                        John Kenneth Adriano
                      </h3>
                      <p className="text-gray-500">Frontend Developer</p>
                      <div className="flex space-x-4 mt-3">
                        <a
                          href={"https://www.facebook.com/adrianojkenneth"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-facebook"></i>
                        </a>
                        <a
                          href={"https://github.com/jkamogus"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-github"></i>
                        </a>
                      </div>
                    </Box>
                  </Column>

                  <Column className="teamcard hideX flex flex-col items-center">
                    <Box className="bg-white p-6 rounded-lg shadow-md text-center h-full w-64 flex flex-col items-center justify-center">
                      <img
                        src={rivera}
                        alt="Team Member 1"
                        className="w-32 h-32 rounded-full mb-4"
                      />
                      <h3 className="text-lg font-bold">May Pearl Rivera</h3>
                      <p className="text-gray-500">Frontend Developer</p>
                      <div className="flex space-x-4 mt-3">
                        <a
                          href={"https://www.facebook.com/maypearl.rivera"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-facebook"></i>
                        </a>
                        <a
                          href={"https://github.com/Nepheleee"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-github"></i>
                        </a>
                      </div>
                    </Box>
                  </Column>

                  <Column className=" teamcard hideX flex flex-col items-center">
                    <Box className="bg-white p-6 rounded-lg shadow-md text-center h-full w-64 flex flex-col items-center justify-center">
                      <img
                        src={clave}
                        alt="Team Member 1"
                        className="w-32 h-32 rounded-full mb-4"
                      />
                      <h3 className="text-lg font-bold">Ma. Loelaida Clave</h3>
                      <p className="text-gray-500">Frontend Developer</p>
                      <div className="flex space-x-4 mt-3">
                        <a
                          href={"https://www.facebook.com/leeelss"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-facebook"></i>
                        </a>
                        <a
                          href={"https://github.com/leee01"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="text-3xl fa-brands fa-github"></i>
                        </a>
                      </div>
                    </Box>
                  </Column>
                </HorizontalColumns>
              </VerticalColumns>
            </Section>
          </div>
          {/* End Meet the Team Section */}

          {/* FAQ Section */}
          <Section id="faq" className="align-top mt-20">
            <VerticalColumns>
              <h2 className="text-center text-5xl font-bold text-white mb-6 sm:text-2xl">
                Frequently Asked Questions
              </h2>
              <Column>
                <Box className="text-2xl text-white leading-10 font-outline-2 tracking-3 text-center max-w-[1250px] sm:text-sm">
                  <Accordion className="bg-white">
                    {/* How to purchase ReVendo Card? */}
                    <Accordion.Panel>
                      <Accordion.Title>
                        How to purchase ReVendo Card?
                      </Accordion.Title>
                      <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          To purchase ReVendo Card, you can go to the nearest
                          store for buying our ReVendo Card. The card is worth
                          of 100 pesos and you can use it for 1 year.
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          To purchase you need to present atleast one valid ID
                          for identification and you need to fill up the form
                          for the registration of the card.
                        </p>
                      </Accordion.Content>
                    </Accordion.Panel>
                    {/* How to earn points? */}
                    <Accordion.Panel>
                      <Accordion.Title>How to earn points?</Accordion.Title>
                      <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          To earn points you need plastic bottles to be inserted
                          in the machine. The machine will scan the plastic
                          bottle and will give you points. The points will be in
                          your ReVendo Card. The points will be converted into a
                          reward points. The reward points can be used to
                          charging station to exchange the points in charging
                          time for your cellphone.
                        </p>
                      </Accordion.Content>
                    </Accordion.Panel>
                    {/* What kind of plastic bottles accepts in the machine? */}
                    <Accordion.Panel>
                      <Accordion.Title>
                        What kind of plastic bottles accepts in the machine?
                      </Accordion.Title>
                      <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          The machine accept plastic bottles that are
                          Polyethylene terephthalate(PET) plastic bottles. The
                          machine will not accept other plastic bottles that are
                          not PET plastic bottles. The machine will indicate if
                          the plastic bottle is accepted or not.
                        </p>
                      </Accordion.Content>
                    </Accordion.Panel>
                    {/* How charge my cellphone in the charging station? */}
                    <Accordion.Panel>
                      <Accordion.Title>
                        How charge my cellphone in the charging station?
                      </Accordion.Title>
                      <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          To charge your cellphone you need to tap your ReVendo
                          Card in the charging station. The charging station
                          will scan your card and will deduct the points in your
                          card. The points will be converted into charging time
                          for your cellphone. The charging station will indicate
                          the charging time for your cellphone. The card must
                          have balance and still valid to use the charging
                          station.
                        </p>
                      </Accordion.Content>
                    </Accordion.Panel>
                    {/* What is the pointing system for plastic bottles? */}
                    <Accordion.Panel>
                      <Accordion.Title>
                        What is the pointing system for plastic bottles?
                      </Accordion.Title>
                      <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          There are three classification of plastic bottles in a
                          points system. The small plastic bottles are worth of
                          1 point, the medium plastic bottles are worth of 2
                          points and the large plastic bottles are worth of 3
                          points. You can view our points system in guide how
                          size of plastic bottles works. Click here to view the
                          guide.
                        </p>
                      </Accordion.Content>
                    </Accordion.Panel>
                    <Accordion.Panel>
                      <Accordion.Title>
                        What happen if the plastic bottle is rejected?
                      </Accordion.Title>
                      <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          If the plastic bottle is reject it will indicate led
                          lights and sound that is not accepted. You need to get
                          the bottle and try to insert valid plastic bottle.
                          Only clean plastic bottles or PET bottles are accepted
                          in order to get points.
                        </p>
                      </Accordion.Content>
                    </Accordion.Panel>
                  </Accordion>
                </Box>
              </Column>
            </VerticalColumns>
          </Section>
          {/* End FAQ Section */}

          {/* Contact Us Section */}
          <Section id="contact_us">
            <VerticalColumns>
              <h2 className="text-center text-5xl font-bold text-white mb-6 sm:text-2xl">
                Contact Us
              </h2>
            </VerticalColumns>
          </Section>
          {/* End Contact Us Section */}

          <footer className="bg-gray-800 text-white p-5 text-center">
            <p>&copy; 2024 ReVendo. All rights reserved.</p>
          </footer>
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

const VerticalColumns = ({ children, className }: CommonProps) => (
  <div className={"flex flex-col gap-4 items-center " + className}>
    {children}
  </div>
);

const HorizontalColumns = ({ children, className }: CommonProps) => (
  <div className={"flex flex-col imgH:flex-row gap-4 " + className}>
    {children}
  </div>
);

const Column = ({ children, className }: CommonProps) => (
  <div className={" " + className}>{children}</div>
);

const Box = ({ children, className }: CommonProps) => (
  <div className={" " + className}>{children}</div>
);
