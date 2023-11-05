import { useEffect, useState } from "react";
import SidebarLink from "./SidebarLink";
import { useLocation } from "react-router-dom";

const SidebarComponent = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  return (
    <div className="fixed sidebar bg-[#35363D] text-white w-20 h-screen flex flex-col justify-center items-center z-50">
      <SidebarLink
        to="/dashboard"
        tooltipContent="Dashboard"
        text="dashboard"
        isActive={activeLink === "/dashboard"}
        onClick={() => setActiveLink("/dashboard")}
      />
      <SidebarLink
        to="/rfid"
        tooltipContent="RFID"
        text="style"
        isActive={activeLink === "/rfid"}
        onClick={() => setActiveLink("/rfid")}
      />
      <SidebarLink
        to="/units"
        tooltipContent="Units"
        text="ad_units"
        isActive={activeLink === "/units"}
        onClick={() => setActiveLink("/units")}
      />
      <SidebarLink
        to="/manage-accounts"
        tooltipContent="Accounts"
        text="manage_accounts"
        isActive={activeLink === "/manage-accounts"}
        onClick={() => setActiveLink("/manage-accounts")}
      />
      <SidebarLink
        to="/settings"
        tooltipContent="Settings"
        text="settings"
        isActive={activeLink === "/settings"}
        onClick={() => setActiveLink("/settings")}
      />
    </div>
  );
};

export default SidebarComponent;
