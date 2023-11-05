import { Table } from "flowbite-react";

const TableComponent = () => {
  return (
    <>
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
                <span className="cursor-pointer material-symbols-rounded text-green-600 p-2">
                  edit
                </span>
              </i>
              <i>
                <span className="cursor-pointer material-symbols-rounded text-red-600 p-2">
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
                <span className="cursor-pointer material-symbols-rounded text-green-600 p-2">
                  edit
                </span>
              </i>
              <i>
                <span className="cursor-pointer material-symbols-rounded text-red-600 p-2">
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
                <span className="cursor-pointer material-symbols-rounded text-green-600 p-2">
                  edit
                </span>
              </i>
              <i>
                <span className="cursor-pointer material-symbols-rounded text-red-600 p-2">
                  delete
                </span>
              </i>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
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
    </>
  );
};

export default TableComponent;
