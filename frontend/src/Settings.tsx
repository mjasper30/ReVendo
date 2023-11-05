import SidebarComponent from "./component/SidebarComponent";
import NavbarComponent from "./component/NavbarComponent";
import "./css/index.css";

export default function Settings() {
  return (
    <div className="h-full w-screen flex">
      <SidebarComponent />

      <div className="flex flex-col flex-1 w-full">
        <NavbarComponent />

        <div className="flex items-center justify-center h-full">
          <div className="w-full sm:w-4/5">
            <div className="font-bold text-xl text-white my-10 z-100">
              Settings
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
