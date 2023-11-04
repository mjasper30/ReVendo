export const SidebarData = [
  {
    icon: (
      <i className="icon p-2 my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2 pt-3 mt-3">
        <span className="material-symbols-rounded text-[#2B2D31] p-2">
          {/* White Rectacle Active */}
          <div className="vertical-rectangle absolute top-0 left-[-14px] w-2 h-12 bg-white rounded-lg"></div>
          home
        </span>
      </i>
    ),
    link: "/dashboard",
  },
  {
    icon: (
      <i className="icon p-2 my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2 pt-3">
        <span className="material-symbols-rounded text-[#2B2D31] p-2">
          person_add
        </span>
      </i>
    ),
    link: "/AddUser",
  },
  {
    icon: (
      <i className="icon p-2 my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2 pt-3">
        <span className="material-symbols-rounded text-[#2B2D31] p-2">
          monitoring
        </span>
      </i>
    ),
    link: "/Monitoring",
  },
  {
    icon: (
      <i className="icon p-2 my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2 pt-3">
        <span className="material-symbols-rounded text-[#2B2D31] p-2">
          settings
        </span>
      </i>
    ),
    link: "/Settings",
  },
];
