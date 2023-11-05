import "./css/index.css";
import SidebarComponent from "./component/SidebarComponent";
import NavbarComponent from "./component/NavbarComponent";
import CardsComponent from "./component/CardsComponent";
import TableComponent from "./component/TableComponent";

export default function Dashboard() {
  return (
    <div className="h-full w-screen flex">
      <SidebarComponent />

      <div className="flex flex-col flex-1 w-full">
        <NavbarComponent />

        <div className="flex flex-col ml-24 mx-auto">
          <div className="font-bold text-xl text-white ml-10 my-10 z-100">
            Dashboard
          </div>
          <div className="flex w-full items-center justify-between ml-10 mb-5 gap-4">
            <CardsComponent
              bgColor="bg-green-500"
              icon="manage_accounts"
              title="Registered RFID"
              value="456"
            />
            <CardsComponent
              bgColor="bg-red-500"
              icon="water_bottle"
              title="Plastic Bottles"
              value="7489412"
            />
            <CardsComponent
              bgColor="bg-orange-500"
              icon="inventory_2"
              title="Capacity Status"
              value="Not full"
            />
            <CardsComponent
              bgColor="bg-violet-500"
              icon="battery_charging_full"
              title="Battery Status"
              value="56%"
            />
          </div>
          <div className="flex  ml-10 mb-5 gap-4">
            <TableComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
