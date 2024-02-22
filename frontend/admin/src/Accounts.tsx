import {
  Button,
  Label,
  Modal,
  Pagination,
  Radio,
  Select,
  Table,
  TextInput,
} from "flowbite-react";
import "./css/index.css";
import { useState, useEffect } from "react";
import SidebarComponent from "./component/SidebarComponent";
import NavbarComponent from "./component/NavbarComponent";
import axios from "axios";

interface AccountData {
  id: number;
  name: string;
  gender: string;
  email: string;
  role: string;
}

export default function Accounts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(
    null
  );
  const [accountData, setAccountData] = useState<AccountData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const totalItems = accountData.length;
  const totalPages = Math.ceil(totalItems / 10);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const itemsPerPage = 10;
  const onPageChange = (page: number) => setCurrentPage(page);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Adding RFID data
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/api/account", {
        fname: e.currentTarget.fname.value,
        email: e.currentTarget.email.value,
        gender: e.currentTarget.gender.value,
        password: e.currentTarget.password.value, // Updated field name
        roles: e.currentTarget["roles"].value, // Fix: Added optional chaining
      });

      console.log(response.data); // handle success
      setOpenModal(false); // Close the modal after successful submission
      fetchData();
    } catch (error) {
      console.error("Error:", error); // handle error
    }
  };

  // Modify the fetchData function to filter data based on the search query
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/account");
      const filteredData = response.data.filter((account: AccountData) =>
        Object.values(account)
          .map((value) =>
            typeof value === "string" ? value.toLowerCase() : ""
          )
          .join(" ")
          .includes(searchQuery.toLowerCase())
      );
      setAccountData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to handle edit button click
  const handleEditClick = (account: AccountData) => {
    setSelectedAccount(account);
    setOpenEditModal(true);
  };

  // Function to handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Assuming that your server endpoint for edit is something like "/api/account/:id"
      await axios.put(
        `http://localhost:3001/api/account/${selectedAccount?.id}`,
        {
          fname: e.currentTarget.fname.value,
          email: e.currentTarget.email.value,
          gender: e.currentTarget.gender.value,
          password: e.currentTarget.password.value,
          roles: e.currentTarget["roles"].value,
        }
      );

      // Close the edit modal
      setOpenEditModal(false);

      // Refresh the data after edit
      fetchData();
    } catch (error) {
      console.error("Error updating Account:", error);
    }
  };

  // Function to handle delete button click
  const handleDeleteClick = async () => {
    try {
      // Assuming that your server endpoint for delete is something like "/api/account/:id"
      await axios.delete(
        `http://localhost:3001/api/account/${selectedAccount?.id}`
      );

      // Close the delete modal
      setOpenDeleteModal(false);

      setCurrentPage(1);

      // Refresh the data after deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting RFID:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
  }, [searchQuery]); // Empty dependency array means this effect runs once after the initial render

  return (
    <div className="h-full w-screen flex">
      <SidebarComponent />

      <div className="flex flex-col flex-1 w-full">
        <NavbarComponent />

        <div className="flex items-center justify-center h-full mt-16">
          <div className="w-full sm:w-4/5">
            <div className="font-bold text-xl text-white my-10">
              Manage Accounts
            </div>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
              <Modal.Header>Add User</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <div className="block">
                      <Label htmlFor="name" value="Name" />
                    </div>
                    <TextInput
                      id="fname"
                      type="text"
                      placeholder="Enter name"
                      required
                    />
                    <div className="block">
                      <Label htmlFor="email" value="Email" />
                    </div>
                    <TextInput
                      id="email"
                      type="text"
                      placeholder="Enter email"
                      required
                    />
                    <fieldset className="flex flex-col gap-4">
                      <div className="block">
                        <Label value="Gender" />
                      </div>
                      <div className="flex items-center gap-12">
                        <div className="flex items-center gap-2">
                          <Radio id="male" name="gender" value="Male" />
                          <Label htmlFor="united-state">Male</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Radio id="female" name="gender" value="Female" />
                          <Label htmlFor="gender">Female</Label>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label htmlFor="password" value="Your password" />
                        </div>
                        <TextInput id="password" type="password" required />
                      </div>
                      {/* <div>
                        <div className="mb-2 block">
                          <Label htmlFor="password1" value="Confirm password" />
                        </div>
                        <TextInput id="password1" type="password" required />
                      </div> */}
                    </fieldset>
                    <div className="max-w">
                      <div className="mb-2 block">
                        <Label htmlFor="role" value="Role" />
                      </div>
                      <Select id="roles" required>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </Select>
                    </div>
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
              <Modal.Header>Edit User</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form
                    className="flex max-w flex-col gap-4"
                    onSubmit={handleEditSubmit}
                  >
                    {/* Add input fields with current values for editing */}
                    <TextInput
                      id="fname"
                      type="text"
                      placeholder="Enter name"
                      defaultValue={selectedAccount?.name}
                      required
                    />
                    <TextInput
                      id="email"
                      type="text"
                      placeholder="Enter email"
                      defaultValue={selectedAccount?.email}
                      required
                    />
                    <div className="block">
                      <Label value="Gender" />
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="flex items-center gap-2">
                        <Radio id="male" name="gender" value="Male" />
                        <Label htmlFor="united-state">Male</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Radio id="female" name="gender" value="Female" />
                        <Label htmlFor="gender">Female</Label>
                      </div>
                    </div>
                    <TextInput
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      required
                    />
                    <div className="max-w">
                      <div className="mb-2 block">
                        <Label htmlFor="role" value="Role" />
                      </div>
                      <Select id="roles" required>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </Select>
                    </div>
                    <Button type="submit">Update</Button>
                    <Button
                      color="gray"
                      onClick={() => setOpenEditModal(false)}
                    >
                      Cancel
                    </Button>
                  </form>
                </div>
              </Modal.Body>
            </Modal>

            {/* Delete Modal */}
            <Modal
              show={openDeleteModal}
              size="md"
              onClose={() => setOpenDeleteModal(false)}
              popup
            >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <span className="material-symbols-rounded -ml-1">
                    warning
                  </span>
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this Account?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={handleDeleteClick}>
                      {"Yes, I'm sure"}
                    </Button>
                    <Button
                      color="gray"
                      onClick={() => setOpenDeleteModal(false)}
                    >
                      No, cancel
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>

            <div className="flex items-center justify-between">
              <Button className="mb-5" onClick={() => setOpenModal(true)}>
                <span className="material-symbols-rounded -ml-1">add</span>
                Add User
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
            <Table className="text-center mb-5" striped hoverable>
              <Table.Head className="bg-slate-600">
                <Table.HeadCell>#</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Gender</Table.HeadCell>
                <Table.HeadCell>Role</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {accountData
                  .slice(startIndex, endIndex)
                  .map((account, index) => (
                    <Table.Row
                      key={index}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {account.id}
                      </Table.Cell>
                      <Table.Cell>{account.name}</Table.Cell>
                      <Table.Cell>{account.email}</Table.Cell>
                      <Table.Cell>{account.gender}</Table.Cell>
                      <Table.Cell>{account.role}</Table.Cell>
                      <Table.Cell>
                        <i>
                          <span
                            className="material-symbols-rounded cursor-pointer text-green-600 p-2"
                            onClick={() => handleEditClick(account)}
                          >
                            edit
                          </span>
                        </i>
                        {index !== 0 && ( // Check if it's not the first row
                          <i>
                            <span
                              className="material-symbols-rounded cursor-pointer text-red-600 p-2"
                              onClick={() => {
                                setSelectedAccount(account);
                                setOpenDeleteModal(true);
                              }}
                            >
                              delete
                            </span>
                          </i>
                        )}
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
