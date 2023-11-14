import { Pagination, Table, TextInput } from "flowbite-react";
import "./css/index.css";
import { useState, useEffect } from "react";
import SidebarComponent from "./component/SidebarComponent";
import NavbarComponent from "./component/NavbarComponent";
import axios from "axios";
// import logo from "./assets/Revendo_logo.png";

interface HistoryData {
  id: number;
  rfid_number: string;
  height: number;
  weight: number;
  size: number;
  captured_image: string;
  is_valid: string;
  date: string;
}

export default function RFID() {
  const [currentPage, setCurrentPage] = useState(1);
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);

  const onPageChange = (page: number) => setCurrentPage(page);

  // Function to fetch RFID data
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/history");
      setHistoryData(response.data); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch current RFID value when the component mounts
  useEffect(() => {
    fetchData(); // Initial fetch
  }, []); // Empty dependency array means this effect runs once after the initial render

  // Function to convert blob data to base64
  const convertBlobToBase64 = (blobData: string) => {
    return `data:image/jpeg;base64,${btoa(blobData)}`;
  };

  return (
    <div className="h-full w-screen flex">
      <SidebarComponent />

      <div className="flex flex-col flex-1 w-full">
        <NavbarComponent />

        {/* Main Section */}
        <div className="flex items-center justify-center h-full mt-16">
          <div className="w-full sm:w-4/5">
            <div className="font-bold text-xl text-white my-10 ">History</div>

            <div className="flex items-center justify-between">
              <div className="max-w-xs">
                <TextInput
                  id="search"
                  type="text"
                  placeholder="Search"
                  className="mb-3"
                />
              </div>
            </div>

            <Table className="text-center" striped hoverable>
              <Table.Head className="bg-slate-600">
                <Table.HeadCell>#</Table.HeadCell>
                <Table.HeadCell>RFID Number</Table.HeadCell>
                <Table.HeadCell>Height (cm)</Table.HeadCell>
                <Table.HeadCell>Weight (g)</Table.HeadCell>
                <Table.HeadCell>Size (S,M,L)</Table.HeadCell>
                <Table.HeadCell>Captured Image</Table.HeadCell>
                <Table.HeadCell>Is it Valid?</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {historyData.map((history, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell>{history.rfid_number}</Table.Cell>
                    <Table.Cell>{history.height}</Table.Cell>
                    <Table.Cell>{history.weight}</Table.Cell>
                    <Table.Cell>{history.size}</Table.Cell>
                    <Table.Cell>
                      <img
                        src={convertBlobToBase64(history.captured_image)}
                        alt="Captured Image"
                        style={{ maxWidth: "100%", maxHeight: "100px" }}
                      />
                    </Table.Cell>
                    <Table.Cell>{history.is_valid}</Table.Cell>
                    <Table.Cell>
                      {new Date(history.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                      })}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            <div className="flex overflow-x-auto sm:justify-center mt-3">
              <Pagination
                currentPage={currentPage}
                totalPages={100}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
