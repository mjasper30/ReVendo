import {
  Pagination,
  Table,
  Button,
  Modal,
  Label,
  TextInput,
  Select,
} from "flowbite-react";
import "./css/index.css";
import { useState } from "react";
import SidebarComponent from "./component/SidebarComponent";
import NavbarComponent from "./component/NavbarComponent";

export default function RFID() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const onPageChange = (page: number) => setCurrentPage(page);

  const onSubmit = (e) => {
    e.preventDefault();

    // Fetch POST request to create RFID
    fetch("/api/rfid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rfidNumber: e.target.rfid.value,
        points: e.target.points.value,
        status: e.target["rfid-status"].value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // handle success
        setOpenModal(false);
      })
      .catch((error) => {
        console.error("Error:", error); // handle error
      });
  };

  return (
    <div className="h-full w-screen flex">
      <SidebarComponent />

      <div className="flex flex-col flex-1 w-full">
        <NavbarComponent />

        {/*  */}
        <div className="flex items-center justify-center h-full">
          <div className="w-full sm:w-4/5">
            <div className="font-bold text-xl text-white my-10">RFID</div>

            <Modal show={openModal} onClose={() => setOpenModal(false)}>
              <Modal.Header>Add RFID</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form
                    className="flex max-w flex-col gap-4"
                    onSubmit={onSubmit}
                  >
                    <div className="block">
                      <Label htmlFor="rfid" value="RFID number" />
                    </div>
                    <TextInput
                      id="rfid"
                      type="text"
                      placeholder="Detecting RFID number"
                      required
                    />
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

            <div className="flex items-center justify-between">
              <Button className="mb-5" onClick={() => setOpenModal(true)}>
                <span className="material-symbols-rounded -ml-1">add</span>
                Add RFID
              </Button>
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
