"use client";

import React from "react";
// import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { MenuItem } from "@/types/menuItem";
import { useAuth } from "@/utils/use-auth";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}



const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  // const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const { user } = useAuth()

  const items: MenuItem[] =
    [
      {
        icon: (
          <svg className="fill-current" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="-3.14 -3.14 37.64 37.64" xmlSpace="preserve" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.125428"></g><g id="SVGRepo_iconCarrier"> <g> <g>
            <path d="M15.679,0C7.033,0,0.001,7.033,0.001,15.678c0,8.646,7.032,15.68,15.678,15.68c8.644,0,15.677-7.033,15.677-15.68 C31.356,7.033,24.323,0,15.679,0z M15.679,28.861c-7.27,0-13.183-5.913-13.183-13.184c0-7.268,5.913-13.183,13.183-13.183 c7.269,0,13.182,5.915,13.182,13.183C28.861,22.948,22.948,28.861,15.679,28.861z"></path> <path d="M19.243,12.368V7.33c0-0.868-0.703-1.57-1.57-1.57h-3.396c-0.867,0-1.569,0.703-1.569,1.57v5.038h-5.04 c-0.867,0-1.569,0.703-1.569,1.57v3.468c0,0.867,0.702,1.57,1.569,1.57h5.039v5.037c0,0.867,0.702,1.57,1.569,1.57h3.397 c0.866,0,1.569-0.703,1.569-1.57v-5.037h5.038c0.867,0,1.57-0.703,1.57-1.57v-3.468c0-0.868-0.703-1.57-1.57-1.57H19.243z">
            </path> </g> </g> </g></svg>
        ),
        label: "Irradiação Intensiva",
        route: "/uti",
      },
    ]

  const adminGroup: { name: string, menuItems: MenuItem[] } = {
    name: "ADMIN", menuItems: [{
      label: "Sessoes",
      route: "/admin/sessoes",
      icon: (<svg className="fill-current" width="18px" height="18px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>group</title> <g id="Page-1" stroke="none" strokeWidth="1" > <g id="icon" transform="translate(64.000000, 64.000000)"> <path d="M106.666667,1.42108547e-14 L106.666667,42.6666667 L42.6666667,42.6666667 L42.6666667,341.333333 L106.666667,341.333333 L106.666667,384 L1.42108547e-14,384 L1.42108547e-14,1.42108547e-14 L106.666667,1.42108547e-14 Z M384,1.42108547e-14 L384,384 L277.333333,384 L277.333333,341.333333 L341.333333,341.333333 L341.333333,42.6666667 L277.333333,42.6666667 L277.333333,1.42108547e-14 L384,1.42108547e-14 Z M298.666667,256 L298.666667,298.666667 L85.3333333,298.666667 L85.3333333,256 L298.666667,256 Z M298.666667,170.666667 L298.666667,213.333333 L85.3333333,213.333333 L85.3333333,170.666667 L298.666667,170.666667 Z M298.666667,85.3333333 L298.666667,128 L85.3333333,128 L85.3333333,85.3333333 L298.666667,85.3333333 Z" id="Combined-Shape"> </path> </g> </g> </g></svg>)
    },
    {
      label: "Membros",
      route: "/admin/membros",
      icon: (<svg className="fill-current" width="18px" height="18px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>id-card</title> <path d="M28 5.25h-24c-1.518 0.002-2.748 1.232-2.75 2.75v16c0.002 1.518 1.232 2.748 2.75 2.75h24c1.518-0.002 2.748-1.232 2.75-2.75v-16c-0.002-1.518-1.232-2.748-2.75-2.75h-0zM4 6.75h24c0.69 0.001 1.249 0.56 1.25 1.25v1.25h-26.5v-1.25c0.001-0.69 0.56-1.249 1.25-1.25h0zM28 25.25h-24c-0.69-0.001-1.249-0.56-1.25-1.25v-13.25h26.5v13.25c-0.001 0.69-0.56 1.249-1.25 1.25h-0zM9.645 17.628c1.455 0 2.635-1.18 2.635-2.635s-1.18-2.635-2.635-2.635c-1.455 0-2.635 1.18-2.635 2.635v0c0.001 1.455 1.18 2.633 2.635 2.635h0zM9.645 13.858c0.627 0 1.135 0.508 1.135 1.135s-0.508 1.135-1.135 1.135c-0.627 0-1.135-0.508-1.135-1.135 0 0 0 0 0 0v0c0.001-0.627 0.508-1.134 1.135-1.135h0zM9.645 18.811c-2.15 0.009-3.947 1.51-4.41 3.52l-0.006 0.031c-0.011 0.048-0.017 0.103-0.017 0.16 0 0.414 0.336 0.75 0.75 0.75 0.357 0 0.656-0.25 0.731-0.585l0.001-0.005c0.309-1.366 1.512-2.371 2.951-2.371s2.642 1.005 2.947 2.351l0.004 0.020c0.077 0.338 0.375 0.587 0.732 0.587 0.414 0 0.75-0.336 0.75-0.75 0-0.056-0.006-0.11-0.018-0.163l0.001 0.005c-0.469-2.041-2.265-3.541-4.414-3.551h-0.001zM26 13.25h-8c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h8c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0zM26 17.25h-8c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h8c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0zM26 21.25h-8c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h8c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0z"></path> </g></svg>)
    },
    {
      icon: (
        <svg className="fill-current" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="-3.14 -3.14 37.64 37.64" xmlSpace="preserve" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.125428"></g><g id="SVGRepo_iconCarrier"> <g> <g>
          <path d="M15.679,0C7.033,0,0.001,7.033,0.001,15.678c0,8.646,7.032,15.68,15.678,15.68c8.644,0,15.677-7.033,15.677-15.68 C31.356,7.033,24.323,0,15.679,0z M15.679,28.861c-7.27,0-13.183-5.913-13.183-13.184c0-7.268,5.913-13.183,13.183-13.183 c7.269,0,13.182,5.915,13.182,13.183C28.861,22.948,22.948,28.861,15.679,28.861z"></path> <path d="M19.243,12.368V7.33c0-0.868-0.703-1.57-1.57-1.57h-3.396c-0.867,0-1.569,0.703-1.569,1.57v5.038h-5.04 c-0.867,0-1.569,0.703-1.569,1.57v3.468c0,0.867,0.702,1.57,1.569,1.57h5.039v5.037c0,0.867,0.702,1.57,1.569,1.57h3.397 c0.866,0,1.569-0.703,1.569-1.57v-5.037h5.038c0.867,0,1.57-0.703,1.57-1.57v-3.468c0-0.868-0.703-1.57-1.57-1.57H19.243z">
          </path> </g> </g> </g></svg>
      ),
      label: "Lista Irradiação Intensiva",
      route: "/admin/intensiva",
    },
    {
      label: "Usuários",
      route: "/admin/usuarios",
      icon: (<svg xmlns="http://www.w3.org/2000/svg" className="fill-current" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>)
    },
    ]
  }
  const menuGroups = [
    {
      name: "MENU",
      menuItems: items,
    }
  ];

  if (user && user.admin) {
    menuGroups.push(adminGroup)
  }

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          {/* <div className="flex justify-center items-center space-x-8 p-4"> */}
          <Link href="/uti">
            <div className="flex items-center justify-center space-x-4">
              <Image
                src="/images/logo/comunidade.png"
                alt="Company Logo"
                width={50}
                height={50}
                className="h-10 w-10 object-contain"
              />
              <div className="text-left">
                <h2 className="text-sm font-semibold text-white">Comunidade da Ação</h2>
                <p className="text-xs text-white">Irradiação 🍀</p>
              </div>
            </div>
          </Link>
          {/* </div> */}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"

              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill="#ffffff"
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside >
  );
};

export default Sidebar;
