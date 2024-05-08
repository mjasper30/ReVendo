import { Pagination, Table, Button, Modal, Label, TextInput, Select } from "flowbite-react";
import "./css/index.css";
import { useEffect, useState } from "react";
import SidebarComponent from "./component/SidebarComponent";
import NavbarComponent from "./component/NavbarComponent";
import axios from "axios";

interface RFIDData {
  id: number;
  rfid_number: string;
  holderName: string;
  contact: string;
  email: string;
  points: number;
  status: string;
}

interface CustomError {
  response: {
    status: number;
    data: {
      error: string;
    };
  };
}

export default function RFID() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rfidData, setRfidData] = useState<RFIDData[]>([]);
  const [chargeTime, setChargeTime] = useState(null);
  const [selectedRfid, setSelectedRfid] = useState<RFIDData | null>(null);
  const [currentRFIDValue, setCurrentRFIDValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const totalItems = rfidData.length;
  const totalPages = Math.ceil(totalItems / 10);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const itemsPerPage = 10;
  const onPageChange = (page: number) => setCurrentPage(page);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleClearFile = async () => {
    try {
      const relativeFilePath = "rfidData.txt"; // Assuming "backend" folder is one level up

      const response = await axios.post("http://localhost:3001/clear-text-file", {
        filePath: relativeFilePath,
      });
      if (response.data.success) {
        console.log("Text file cleared successfully on the backend.");
      } else {
        console.error("Error:", response.data.error); // Handle specific errors from the backend
      }
    } catch (err) {
      console.error("Error making request to backend:", err);
    }
  };

  // Adding RFID data
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/api/rfid", {
        rfidNumber: e.currentTarget.rfid.value,
        holderName: e.currentTarget.holderName.value,
        contact: e.currentTarget.contact.value,
        email: e.currentTarget.email.value,
        points: e.currentTarget.points.value,
        status: e.currentTarget["rfid-status"].value,
      });

      console.log(response.data); // handle success
      setOpenModal(false); // Close the modal after successful submission
      // You might want to refresh the data or update the state after a successful submission.
      fetchData();
    } catch (error) {
      if (
        (error as CustomError).response &&
        (error as CustomError).response.status === 400 &&
        (error as CustomError).response.data.error === "RFID number already exists"
      ) {
        // Display error message for duplicated RFID number
        alert("This RFID number is already existing");
      } else {
        console.error("Error:", error); // handle other errors
      }
    }
  };

  // Modify the fetchData function to filter data based on the search query
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/rfid");
      const filteredData = response.data.filter((rfid: RFIDData) =>
        Object.values(rfid)
          .map((value) => (typeof value === "string" ? value.toLowerCase() : ""))
          .join(" ")
          .includes(searchQuery.toLowerCase())
      );
      setRfidData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchChargeTime = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/charge-time"); // Assuming your API endpoint
        const data = await response.json();
        setChargeTime(data[0].minute); // Assuming minute is in the first element of the response
      } catch (error) {
        console.error("Error fetching charge time:", error);
        // Handle error gracefully, e.g., display an error message to the user
      }
    };

    fetchChargeTime();
  }, []);

  // Function to handle edit button click
  const handleEditClick = (rfid: RFIDData) => {
    setSelectedRfid(rfid);
    setOpenEditModal(true);
  };

  // Function to handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Assuming that your server endpoint for edit is something like "/api/rfid/:id"
      await axios.put(`http://localhost:3001/api/rfid/${selectedRfid?.id}`, {
        rfid_number: e.currentTarget.rfid.value,
        holderName: e.currentTarget.holderName.value,
        contact: e.currentTarget.contact.value,
        email: e.currentTarget.email.value,
        points: e.currentTarget.points.value,
        status: e.currentTarget["rfid-status"].value,
      });

      // Close the edit modal
      setOpenEditModal(false);

      // Refresh the data after edit
      fetchData();
    } catch (error) {
      console.error("Error updating RFID:", error);
    }
  };

  // Function to handle delete button click
  const handleDeleteClick = async () => {
    try {
      // Assuming that your server endpoint for delete is something like "/api/rfid/:id"
      await axios.delete(`http://localhost:3001/api/rfid/${selectedRfid?.id}`);

      // Close the delete modal
      setOpenDeleteModal(false);

      setCurrentPage(1);

      // Refresh the data after deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting RFID:", error);
    }
  };

  // Fetch current RFID value when the component mounts
  useEffect(() => {
    const fetchCurrentValue = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/rfid/currentValue");
        setCurrentRFIDValue(response.data.rfidValue);
      } catch (error) {
        console.error("Error fetching current value:", error);
      }
    };

    fetchCurrentValue();

    fetchData(); // Initial fetch

    // Set up an interval to fetch data every 3 seconds
    const intervalId = setInterval(fetchCurrentValue, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [searchQuery]); // Empty dependency array means this effect runs once after the initial render

  return (
    <div className="h-full w-screen flex">
      <SidebarComponent />

      <div className="flex flex-col flex-1 w-full">
        <NavbarComponent />

        {/* Main Section */}
        <div className="flex items-center justify-center h-full mt-16">
          <div className="w-full sm:w-4/5">
            <div className="font-bold text-xl text-white my-10 ">RFID</div>

            {/* Add RFID Modal */}
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
              <Modal.Header>Add RFID</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form className="flex max-w flex-col gap-4" onSubmit={onSubmit}>
                    <div className="block">
                      <Label htmlFor="rfid" value="RFID number" />
                    </div>
                    <TextInput
                      id="rfid"
                      type="text"
                      placeholder="Detecting RFID number"
                      readOnly
                      required
                      value={currentRFIDValue}
                    />
                    <div className="block">
                      <Label htmlFor="holderName" value="Name" />
                    </div>
                    <TextInput id="holderName" type="text" placeholder="Input Name" required />
                    <div className="block">
                      <Label htmlFor="contact" value="Contact" />
                    </div>
                    <TextInput type="tel" id="contact" name="contact" pattern="[0-9]{11}" />
                    <div className="block">
                      <Label htmlFor="email" value="Email" />
                    </div>
                    <TextInput id="email" type="text" placeholder="Input Email" required />
                    <div className="max-w">
                      <div className="mb-2 block">
                        <Label htmlFor="rfid-status" value="Status of RFID" />
                      </div>
                      <Select id="rfid-status" required>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Disable">Disable</option>
                      </Select>
                    </div>
                    <div className="block">
                      <Label htmlFor="points" value="RFID Points" />
                    </div>
                    <TextInput
                      className="mb-4"
                      id="points"
                      type="number"
                      placeholder="Enter RFID Points"
                      required
                    />
                    <Button type="submit">Add</Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                      Cancel
                    </Button>
                  </form>
                </div>
              </Modal.Body>
            </Modal>

            {/* Edit Modal */}
            <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
              <Modal.Header>Edit RFID</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form className="flex max-w flex-col gap-4" onSubmit={handleEditSubmit}>
                    <div className="block">
                      <Label htmlFor="rfid" value="RFID number" />
                    </div>
                    <TextInput
                      id="rfid"
                      type="text"
                      placeholder="Detecting RFID number"
                      required
                      value={selectedRfid?.rfid_number || ""}
                      onChange={(e) =>
                        setSelectedRfid({
                          ...selectedRfid!,
                          rfid_number: e.target.value,
                        })
                      }
                    />
                    <div className="block">
                      <Label htmlFor="holderName" value="Name" />
                    </div>
                    <TextInput id="holderName" type="text" placeholder="Input Name" required />
                    <div className="block">
                      <Label htmlFor="contact" value="Contact" />
                    </div>
                    <TextInput type="tel" id="contact" name="contact" pattern="[0-9]{11}" />
                    <div className="block">
                      <Label htmlFor="email" value="Email" />
                    </div>
                    <TextInput id="email" type="text" placeholder="Input Email" required />
                    <div className="max-w">
                      <div className="mb-2 block">
                        <Label htmlFor="rfid-status" value="Status of RFID" />
                      </div>
                      <Select
                        id="rfid-status"
                        required
                        value={selectedRfid?.status || ""}
                        onChange={(e) =>
                          setSelectedRfid({
                            ...selectedRfid!,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Disable">Disable</option>
                      </Select>
                    </div>
                    <div className="block">
                      <Label htmlFor="points" value="RFID Points" />
                    </div>
                    <TextInput
                      className="mb-4"
                      id="points"
                      type="number"
                      placeholder="Enter RFID Points"
                      required
                      value={selectedRfid?.points || 0}
                      onChange={(e) =>
                        setSelectedRfid({
                          ...selectedRfid!,
                          points: +e.target.value,
                        })
                      }
                    />
                    <Button type="submit">Update</Button>
                    <Button color="gray" onClick={() => setOpenEditModal(false)}>
                      Cancel
                    </Button>
                  </form>
                </div>
              </Modal.Body>
            </Modal>

            {/* Delete Modal */}
            <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup>
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <span className="material-symbols-rounded -ml-1">warning</span>
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this RFID?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={handleDeleteClick}>
                      {"Yes, I'm sure"}
                    </Button>
                    <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                      No, cancel
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>

            <div className="flex items-center justify-between">
              <Button
                className="mb-5"
                onClick={() => {
                  setOpenModal(true);
                  handleClearFile(); // Call the function to clear the text file
                  setCurrentRFIDValue(""); // Clear RFID value when opening modal
                }}
              >
                <span className="material-symbols-rounded -ml-1">add</span>
                Add RFID
              </Button>
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
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Contact Number</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Points</Table.HeadCell>
                <Table.HeadCell>Total Minutes</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {rfidData.slice(startIndex, endIndex).map((rfid, index) => (
                  <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {rfid.id}
                    </Table.Cell>
                    <Table.Cell>{rfid.rfid_number}</Table.Cell>
                    <Table.Cell>{rfid.holderName}</Table.Cell>
                    <Table.Cell>{rfid.contact}</Table.Cell>
                    <Table.Cell>{rfid.email}</Table.Cell>
                    <Table.Cell>{rfid.points}</Table.Cell>
                    <Table.Cell>
                      {chargeTime !== null ? `${rfid.points * chargeTime} Minutes` : "0 Minutes"}
                    </Table.Cell>
                    <Table.Cell>{rfid.status}</Table.Cell>
                    <Table.Cell>
                      <i>
                        <span
                          className="material-symbols-rounded cursor-pointer text-green-600 p-2"
                          onClick={() => handleEditClick(rfid)}
                        >
                          edit
                        </span>
                      </i>
                      <i>
                        <span
                          className="material-symbols-rounded cursor-pointer text-red-600 p-2"
                          onClick={() => {
                            setSelectedRfid(rfid);
                            setOpenDeleteModal(true);
                          }}
                        >
                          delete
                        </span>
                      </i>
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
