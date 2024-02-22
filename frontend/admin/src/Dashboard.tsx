import { useState, useEffect } from "react";
import * as echarts from "echarts";
import axios from "axios";
import "./css/index.css";
import SidebarComponent from "./component/SidebarComponent";
import NavbarComponent from "./component/NavbarComponent";
import CardsComponent from "./component/CardsComponent";

export default function Dashboard() {
  const [registeredRFIDCount, setRegisteredRFIDCount] = useState(null);
  const [numberOfPlasticBottleCount, setNumberOfPlasticBottleCount] =
    useState(null);
  const [storageStatus, setStorageStatus] = useState(null);
  const [numberOfRejected, setNumberOfRejected] = useState(null);

  useEffect(() => {
    // Fetch data initially
    fetchData();

    // Fetch data every 3 seconds
    const intervalId = setInterval(fetchData, 3000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures that the effect runs only once on mount

  const fetchData = () => {
    // Use Promise.all to wait for all Axios requests to complete
    Promise.all([
      axios.get("http://localhost:3001/api/registeredRFIDCount"),
      axios.get("http://localhost:3001/api/numberOfPlasticBottleCount"),
      axios.get("http://localhost:3001/api/getStorageStatus"),
      axios.get("http://localhost:3001/api/numberOfRejected"),
    ])
      .then((responses) => {
        // Destructure responses to get data from each request
        const [
          registeredRFIDResponse,
          plasticBottleResponse,
          storageStatusResponse,
          rejectedResponse,
        ] = responses;

        setRegisteredRFIDCount(registeredRFIDResponse.data.count);
        setNumberOfPlasticBottleCount(plasticBottleResponse.data.count);
        setStorageStatus(storageStatusResponse.data.status);
        setNumberOfRejected(rejectedResponse.data.count);

        // Update the charts after setting the state
        updateCharts();
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const updateCharts = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // Get the current date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-PH", options);

    // Initialize the chart on component mount
    const chartDomNumberOfPlasticBottles = document.getElementById(
      "number-of-plastic-bottles"
    )!;
    const myChartNumberOfPlasticBottles = echarts.init(
      chartDomNumberOfPlasticBottles
    );

    const chartDomAcceptedRejected =
      document.getElementById("accepted-rejected")!;
    const myChartAcceptedRejected = echarts.init(chartDomAcceptedRejected);

    // Define the chart options
    const optionNumberOfPlasticBottles = {
      title: {
        text: "Number of plastic bottles",
        subtext: "Today - " + formattedDate,
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)", // This sets the tooltip content
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "50%",
          data: [
            { value: 1048, name: "Small" },
            { value: 735, name: "Medium" },
            { value: 580, name: "Large" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            show: true,
            formatter: "{b}: {c} ({d}%)", // This sets the label format
          },
        },
      ],
    };

    const optionAcceptedRejected = {
      title: {
        text: "Accepted and rejected",
        subtext: "Today - " + formattedDate,
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)", // This sets the tooltip content
      },
      legend: {
        orient: "vertical",
        left: " ",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "50%",
          data: [
            { value: 42, name: "Accepted" },
            { value: 10, name: "Rejected" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            show: true,
            formatter: "{b}: {c} ({d}%)", // This sets the label format
          },
        },
      ],
    };

    // Set the chart options
    myChartNumberOfPlasticBottles.setOption(optionNumberOfPlasticBottles);
    myChartAcceptedRejected.setOption(optionAcceptedRejected);

    // Set the chart options
    myChartNumberOfPlasticBottles.setOption(optionNumberOfPlasticBottles);
    myChartAcceptedRejected.setOption(optionAcceptedRejected);

    // Make the chart responsive
    window.addEventListener("resize", () => {
      myChartNumberOfPlasticBottles.resize();
      myChartAcceptedRejected.resize();
    });

    // Clean up the chart on component unmount
    return () => {
      myChartNumberOfPlasticBottles.dispose();
      myChartAcceptedRejected.dispose();
      window.removeEventListener("resize", () => {
        myChartNumberOfPlasticBottles.resize();
        myChartAcceptedRejected.resize();
      });
    };
  };

  return (
    <div className="h-full w-screen flex">
      <SidebarComponent />

      <div className="flex flex-col flex-1 w-full">
        <NavbarComponent />

        <div className="flex flex-col ml-24 mx-auto mt-10">
          <div className="font-bold text-xl text-white ml-10 my-10 z-100">
            Dashboard
          </div>
          <div className="flex w-full items-center justify-between ml-10 mb-5 gap-4">
            <CardsComponent
              bgColor="bg-green-500"
              icon="manage_accounts"
              title="Registered RFID"
              value={
                registeredRFIDCount !== null
                  ? registeredRFIDCount
                  : "Loading..."
              }
            />
            <CardsComponent
              bgColor="bg-red-500"
              icon="water_bottle"
              title="Plastic Bottles"
              value={
                numberOfPlasticBottleCount !== null
                  ? numberOfPlasticBottleCount
                  : "Loading..."
              }
            />
            <CardsComponent
              bgColor="bg-orange-500"
              icon="inventory_2"
              title="Storage Status"
              value={storageStatus !== null ? storageStatus : "Loading..."}
            />
            <CardsComponent
              bgColor="bg-violet-500"
              icon="battery_charging_full"
              title="Battery Status"
              value="56%"
            />
          </div>
          <div className="flex w-full items-center justify-between ml-10 my-3">
            <div
              id="number-of-plastic-bottles"
              style={{
                width: "540px",
                height: "300px",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Center horizontally
                justifyContent: "center", // Center vertically
              }}
            ></div>
            <div
              id="accepted-rejected"
              style={{
                width: "540px",
                height: "300px",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Center horizontally
                justifyContent: "center", // Center vertically
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
