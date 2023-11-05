// SidebarComponent.js
import { Tooltip } from "flowbite-react";
import { Link } from "react-router-dom";

const SidebarComponent = () => {
  return (
    <div className="fixed sidebar bg-[#35363D] text-white w-20 h-screen flex flex-col justify-center items-center z-50">
      <Link
        className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
        to="/dashboard"
      >
        <Tooltip content="Dashboard" placement="right">
          <i>
            <span className="material-symbols-rounded text-[#2B2D31] p-2">
              {/* White Rectacle Active */}
              <div className="vertical-rectangle absolute top-0 left-[-14px] w-2 h-10 bg-white rounded-lg"></div>
              dashboard
            </span>
          </i>
        </Tooltip>
      </Link>
      <Link
        className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
        to="/rfid"
      >
        <Tooltip content="RFID" placement="right">
          <i>
            <span className="material-symbols-rounded text-[#2B2D31] p-2">
              style
            </span>
          </i>
        </Tooltip>
      </Link>
      <Link
        className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
        to="/units"
      >
        <Tooltip content="Units" placement="right">
          <i>
            <span className="material-symbols-rounded text-[#2B2D31] p-2">
              ad_units
            </span>
          </i>
        </Tooltip>
      </Link>
      <Link
        className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
        to="/manage-accounts"
      >
        <Tooltip content="Accounts" placement="right">
          <i>
            <span className="material-symbols-rounded text-[#2B2D31] p-2">
              manage_accounts
            </span>
          </i>
        </Tooltip>
      </Link>
      <Link
        className="icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2"
        to="/settings"
      >
        <Tooltip content="Settings" placement="right">
          <i>
            <span className="material-symbols-rounded text-[#2B2D31] p-2">
              settings
            </span>
          </i>
        </Tooltip>
      </Link>
    </div>
  );
};

export default SidebarComponent;
