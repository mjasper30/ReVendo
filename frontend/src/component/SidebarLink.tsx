import { Tooltip } from "flowbite-react";
import { MouseEventHandler } from "react";
import { Link } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  tooltipContent: string;
  text: string;
  isActive: boolean;
  onClick: MouseEventHandler<HTMLAnchorElement>;
}

const SidebarLink = ({
  to,
  tooltipContent,
  text,
  isActive,
  onClick,
}: SidebarLinkProps) => {
  return (
    <Link
      className={`icon my-4 text-2xl bg-[#FFFFFF] rounded-[15px] mr-1 drop-shadow-md hover:drop-shadow-xl cursor-pointer ml-2 ${
        isActive ? "active" : ""
      }`}
      to={to}
      onClick={onClick}
    >
      <Tooltip content={tooltipContent} placement="right">
        <i>
          <span className="material-symbols-rounded text-[#2B2D31] p-2">
            {text}
          </span>
        </i>
      </Tooltip>
      {isActive && (
        <div className="vertical-rectangle absolute top-0 left-[-14px] w-2 h-10 bg-white rounded-lg"></div>
      )}
    </Link>
  );
};

export default SidebarLink;
