import SidebarComponent from "./component/SidebarComponent";
import NavbarComponent from "./component/NavbarComponent";
import { Button, TextInput, Table, Modal, Label } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./css/index.css";

interface BottleData {
  id: number;
  bottle_size: string;
  height_size: string;
  point: string;
}

export default function Settings() {
  const [bottleData, setBottleData] = useState<BottleData[]>([]);
  const [chargeTime, setChargeTime] = useState<string>("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedBottle, setSelectedBottle] = useState<BottleData | null>(null);
  const [newChargeTime, setNewChargeTime] = useState<string>("");

  useEffect(() => {
    // Fetch data from the server when the component mounts
    fetchData();

    // Polling interval (e.g., every 5 seconds)
    const pollingInterval = setInterval(() => {
      fetchData();
    }, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(pollingInterval);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Function to handle edit button click
  const handleEditClick = (bottle: BottleData) => {
    setSelectedBottle(bottle);
    setOpenEditModal(true);
  };

  const fetchData = async () => {
    try {
      // Fetch bottle data
      const bottleResponse = await axios.get(
        "http://localhost:3001/api/get-bottle-data"
      );
      setBottleData(bottleResponse.data);

      // Fetch charge time
      const chargeTimeResponse = await axios.get(
        "http://localhost:3001/api/charge_time"
      );
      setChargeTime(chargeTimeResponse.data[0]?.minute || ""); // Use the first result or an empty string if not found
    } catch (error) {
      console.error("Error fetching data", error);
      // Handle error, e.g., show an error message
    }
  };

  // Function to handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (selectedBottle) {
        await axios.put(
          `http://localhost:3001/api/update-bottle/${selectedBottle.id}`,
          {
            bottle_size: e.currentTarget.bottle_size.value,
            height_size: e.currentTarget.height_size.value,
            point: e.currentTarget.point.value,
          }
        );

        setOpenEditModal(false);
        fetchData(); // Refresh the data after edit
      }
    } catch (error) {
      console.error("Error updating Plastic Bottle:", error);
    }
  };

  // Function to handle save button click
  const handleSaveClick = async (chargeTimeValue: string) => {
    try {
      // Update the charge time on the server
      await axios.put(`http://localhost:3001/api/charge_time/`, {
        charge_time: chargeTimeValue,
      });

      fetchData();

      // Clear the input after successful save
      setNewChargeTime("");

      // You can add a success message or perform additional actions if needed
    } catch (error) {
      console.error("Error updating charge time:", error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className="h-full w-screen flex">
      {/* Edit Modal */}
      <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Modal.Header>Edit Plastic Bottle Info</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form
              className="flex max-w flex-col gap-4"
              onSubmit={handleEditSubmit}
            >
              <div className="block">
                <Label htmlFor="bottle_size" value="Bottle Size" />
              </div>
              <TextInput
                className="mb-4"
                id="bottle_size"
                type="text"
                placeholder="Bottle Size"
                required
                value={selectedBottle?.bottle_size}
                onChange={(e) =>
                  setSelectedBottle({
                    ...selectedBottle!,
                    bottle_size: e.target.value,
                  })
                }
              />
              <div className="max-w">
                <div className="mb-2 block">
                  <Label htmlFor="height_size" value="Bottle Size" />
                </div>
                <TextInput
                  className="mb-4"
                  id="height_size"
                  type="text"
                  placeholder="Bottle Size"
                  required
                  value={selectedBottle?.height_size}
                  onChange={(e) =>
                    setSelectedBottle({
                      ...selectedBottle!,
                      height_size: e.target.value,
                    })
                  }
                />
              </div>
              <div className="block">
                <Label htmlFor="point" value="Points" />
              </div>
              <TextInput
                className="mb-4"
                id="point"
                type="number"
                placeholder="Enter Point"
                required
                value={selectedBottle?.point}
                onChange={(e) =>
                  setSelectedBottle({
                    ...selectedBottle!,
                    point: e.target.value,
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

      <SidebarComponent />

      <div className="flex flex-col flex-1 w-full">
        <NavbarComponent />

        <div className="flex items-center justify-center h-full mt-14">
          <div className="w-full sm:w-4/5">
            <div className="font-bold text-xl text-white my-10 z-100">
              Settings
            </div>
            <div className="font-bold text-lg text-white my-10 z-100">
              Vendo Settings
            </div>
            <div className="font-bold text-sm text-white ml-5 my-3 z-100">
              Set Charge Time (in minutes)
            </div>
            <div className="text-sm text-white ml-5 z-100">
              When you change the value of a point, the charge time will be
              updated accordingly. Example if you set it type 10 minutes, 1
              point will be equal to 10 minutes.
              <span className="font-bold">
                Current setting: 1 Point = {chargeTime} minutes.
              </span>
            </div>
            <div className="w-64 ml-5 mt-3 gap-4">
              <TextInput
                id="charge_time"
                type="number"
                placeholder="Set Charge Time (in minutes)"
                className="mb-3"
                value={newChargeTime}
                onChange={(e) => setNewChargeTime(e.target.value)}
              />
            </div>

            <div className="font-bold text-sm text-white ml-5 my-5 z-100">
              Set Plastic Bottle Points based on size
            </div>
            <Table className="w-50 ml-5 text-center" striped hoverable>
              <Table.Head className="bg-slate-600">
                <Table.HeadCell>#</Table.HeadCell>
                <Table.HeadCell>Bottle Size</Table.HeadCell>
                <Table.HeadCell>Height Size</Table.HeadCell>
                <Table.HeadCell>Point</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {bottleData.map((data) => (
                  <Table.Row
                    key={data.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>{data.id}</Table.Cell>
                    <Table.Cell>{data.bottle_size}</Table.Cell>
                    <Table.Cell>{data.height_size}</Table.Cell>
                    <Table.Cell>{data.point}</Table.Cell>
                    <Table.Cell>
                      <i>
                        <span
                          className="material-symbols-rounded cursor-pointer text-green-600 p-2"
                          onClick={() => handleEditClick(data)}
                        >
                          edit
                        </span>
                      </i>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div className="my-10 z-100">
              <Button
                className="z-100"
                onClick={() => handleSaveClick(newChargeTime)}
              >
                <span className="material-symbols-rounded -ml-1">save</span>
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
