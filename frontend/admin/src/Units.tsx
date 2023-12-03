import {
  Label,
  Pagination,
  Table,
  TextInput,
} from "flowbite-react";
import "./css/index.css";
import SidebarComponent from "./component/SidebarComponent";
import NavbarComponent from "./component/NavbarComponent";
import { useState } from "react";

export default function Units() {
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="h-full w-screen flex">
      <SidebarComponent />

      <div className="flex flex-col flex-1 w-full">
        <NavbarComponent />

        <div className="flex items-center justify-center h-full">
          <div className="w-full sm:w-4/5">
            <div className="font-bold text-xl text-white my-10 z-100">
              Units
            </div>
            <div className="max-w-xs">
              <div className="mb-2 block">
                <Label htmlFor="search" value="Your email" />
              </div>
              <TextInput
                id="search"
                type="text"
                placeholder="Search"
                className="mb-5"
              />
            </div>
            <Table striped hoverable className="text-center">
              <Table.Head className="bg-slate-600">
                <Table.HeadCell>Unit Number</Table.HeadCell>
                <Table.HeadCell>Capacity</Table.HeadCell>
                <Table.HeadCell>Location</Table.HeadCell>
                <Table.HeadCell>Battery</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    1
                  </Table.Cell>
                  <Table.Cell>Full</Table.Cell>
                  <Table.Cell>Caloocan</Table.Cell>
                  <Table.Cell>100%</Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    2
                  </Table.Cell>
                  <Table.Cell>Not Full</Table.Cell>
                  <Table.Cell>Malabon</Table.Cell>
                  <Table.Cell>50%</Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    3
                  </Table.Cell>
                  <Table.Cell>Full</Table.Cell>
                  <Table.Cell>Navotas</Table.Cell>
                  <Table.Cell>60%</Table.Cell>
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
