import SidebarComponent from "./component/SidebarComponent";
import NavbarComponent from "./component/NavbarComponent";
import { ToggleSwitch } from 'flowbite-react';
import { Label, RangeSlider} from 'flowbite-react';
import { useState } from 'react';
import "./css/index.css";

export default function Settings() {

  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(false);
  const [switch3, setSwitch3] = useState(false);
  const [switch4, setSwitch4] = useState(false);
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
              <div className="font-bold text-m text-white my-10 z-100">
                Administrative Settings
              </div>
              <div className="flex max-w-md flex-col gap-4 p-4">
                <ToggleSwitch checked={switch1} label="Disable Website for Maintenance" onChange={setSwitch1} />
                </div>
              <div className="font-bold text-m text-white my-10 z-100">
                Appearance
              </div>
               <div className="flex max-w-md flex-col gap-4 p-4">
                <ToggleSwitch checked={switch2} label="Dark Mode" onChange={setSwitch2} />
                </div>
                <div className="flex max-w-md flex-col gap-4 p-4">
                <ToggleSwitch checked={switch3} label="Among Gus" onChange={setSwitch3} />
                </div>
                <div className="flex max-w-md flex-col gap-4 p-4">
                <ToggleSwitch checked={switch4} label="Fortnite" onChange={setSwitch4} />
                </div>
                <div className="flex max-w-md flex-col gap-4">
                <div>
                  <div className="mb-1 block">
                    <Label htmlFor="default-range" value="Font Size" />
                  <RangeSlider id="default-range" />
                </div>
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>
  );
}
