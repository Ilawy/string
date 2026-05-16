import { CodeXmlIcon, HomeIcon } from "lucide-react";
import type React from "react";
import { Link } from "wouter";

export default function Sidebar() {
  return (
    <div className="max-w-14 bg-base-300 p-2 flex-1">
      <section className="flex flex-col gap-3">
        <SidebarItem tooltip="Home" className="btn-active">
          <Link to="/">
            <HomeIcon size={16} />
          </Link>
        </SidebarItem>
        <SidebarItem tooltip="Process" className="btn-active">
          <Link to="/process">
            <CodeXmlIcon size={16} />
          </Link>
        </SidebarItem>
      </section>
    </div>
  );
}

interface SidebarItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  placement?: "top" | "right" | "bottom" | "left";
  className?: string;
}
const placements = {
  top: "tooltip-top",
  right: "tooltip-right",
  bottom: "tooltip-bottom",
  left: "tooltip-left",
};
function SidebarItem({
  tooltip,
  children,
  placement = "right",
  className,
  ...props
}: SidebarItemProps) {
  return (
    <div className={`tooltip ${placements[placement]}`}>
      <div className="tooltip-content">
        <div className="">{tooltip}</div>
      </div>
      <button className={`btn btn-ghost btn-square ${className}`} {...props}>
        {children}
      </button>
    </div>
  );
}
