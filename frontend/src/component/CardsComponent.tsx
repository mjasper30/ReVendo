import { Card } from "flowbite-react";

const CardsComponent = () => {
  return (
    <>
      <Card className="max-w-sm bg-green-500" horizontal>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            manage_accounts
          </span>
          Registered RFID
        </h5>
        <p className="text-center font-normal text-xl text-gray-700 dark:text-gray-400">
          456
        </p>
      </Card>
      <Card className="max-w-sm bg-red-500" horizontal>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            water_bottle
          </span>
          Plastic Bottles
        </h5>
        <p className="text-center font-normal text-xl text-gray-900 dark:text-gray-400">
          7489412
        </p>
      </Card>
      <Card className="max-w-sm bg-orange-500" horizontal>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            inventory_2
          </span>
          Capacity Status
        </h5>
        <p className="text-center font-normal text-xl text-gray-700 dark:text-gray-400">
          Not full
        </p>
      </Card>
      <Card className="max-w-sm bg-violet-500" horizontal>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            battery_charging_full
          </span>
          Battery Status
        </h5>
        <p className="text-center font-normal text-xl text-gray-700 dark:text-gray-400">
          56%
        </p>
      </Card>
    </>
  );
};

export default CardsComponent;
