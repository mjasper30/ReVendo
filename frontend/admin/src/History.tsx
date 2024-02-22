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
  [key: string]: number | string; // Index signature to allow indexing with a string
}

export default function RFID() {
  const [currentPage, setCurrentPage] = useState(1);
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const totalItems = historyData.length;
  const totalPages = Math.ceil(totalItems / 10);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const itemsPerPage = 10;
  const onPageChange = (page: number) => setCurrentPage(page);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Function to fetch History data
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/history");
      const filteredData = response.data.filter((history: HistoryData) => {
        const valuesToSearch = [
          "rfid_number",
          "height",
          "weight",
          "size",
          "is_valid",
          "date",
        ];
        return valuesToSearch.some((field) =>
          String(history[field])
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      });

      setHistoryData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch current RFID value when the component mounts
  useEffect(() => {
    fetchData(); // Initial fetch
  }, [searchQuery]); // Empty dependency array means this effect runs once after the initial render

  // Function to convert base64 string to image URL
  const convertBase64ToImageUrl = (base64Data: string) => {
    return `data:image/jpeg;base64,${base64Data}`;
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
                  value={searchQuery}
                  onChange={onSearchChange}
                />
              </div>
            </div>

            <Table className="text-center mb-20" striped hoverable>
              <Table.Head className="bg-slate-600">
                <Table.HeadCell>#</Table.HeadCell>
                <Table.HeadCell>RFID Number</Table.HeadCell>
                <Table.HeadCell>Height</Table.HeadCell>
                <Table.HeadCell>Weight (g)</Table.HeadCell>
                <Table.HeadCell>Size (S,M,L)</Table.HeadCell>
                <Table.HeadCell>Captured Image</Table.HeadCell>
                <Table.HeadCell>Is it Valid?</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {historyData
                  .slice(startIndex, endIndex)
                  .map((history, index) => (
                    <Table.Row
                      key={index}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {history.id}
                      </Table.Cell>
                      <Table.Cell>{history.rfid_number}</Table.Cell>
                      <Table.Cell>{history.height}</Table.Cell>
                      <Table.Cell>{history.weight}</Table.Cell>
                      <Table.Cell>{history.size}</Table.Cell>
                      <Table.Cell>
                        <img
                          src={convertBase64ToImageUrl(history.captured_image)}
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

            {totalItems > itemsPerPage && (
              <div className="flex overflow-x-auto sm:justify-center mt-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
