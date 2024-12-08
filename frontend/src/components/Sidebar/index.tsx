"use client";

import React from "react";
// import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { MenuItem } from "@/types/menuItem";
import useAuth from "@/pages/use-auth";

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
          // <svg
          //   className="fill-current"
          //   width="18"
          //   height="18"
          //   viewBox="0 0 18 18"
          //   fill="none"
          //   xmlns="http://www.w3.org/2000/svg"
          // >
          //   <path
          //     d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
          //     fill=""
          //   />
          //   <path
          //     d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
          //     fill=""
          //   />
          // </svg>
          <svg className="fill-current" fill="#000000" width="18px" height="18px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>hand-holding-hand</title> <path d="M29.064 19.701c-0.421-0.177-0.91-0.28-1.423-0.28-0.577 0-1.123 0.13-1.611 0.362l0.023-0.010-5.778 2.595c0.003-0.047 0.026-0.087 0.026-0.134-0.015-1.371-1.129-2.476-2.502-2.476-0.069 0-0.137 0.003-0.204 0.008l0.009-0.001h-3.783l-4.76-1.395c-0.062-0.020-0.133-0.031-0.207-0.031-0.001 0-0.003 0-0.004 0h-2.169v-0.757c-0-0.414-0.336-0.75-0.75-0.75h-3.883c-0.414 0-0.75 0.336-0.75 0.75v0 12.208c0 0.414 0.336 0.75 0.75 0.75h3.883c0.414-0 0.75-0.336 0.75-0.75v0-1.005c1.818 0.284 3.445 0.742 4.987 1.367l-0.149-0.054c1.15 0.416 2.478 0.656 3.862 0.656 0.007 0 0.014 0 0.021-0h-0.001c0.005 0 0.011 0 0.017 0 1.604 0 3.133-0.319 4.528-0.898l-0.078 0.029c1.243-0.553 2.298-1.136 3.297-1.799l-0.082 0.051c0.338-0.209 0.674-0.418 1.014-0.619 1.633-0.967 2.945-1.816 4.129-2.672 0.579-0.412 1.083-0.819 1.563-1.253l-0.014 0.013c0.373-0.302 0.671-0.682 0.871-1.116l0.008-0.019c0.031-0.079 0.048-0.17 0.048-0.266 0-0.057-0.006-0.112-0.018-0.165l0.001 0.005c-0.146-1.017-0.755-1.866-1.603-2.337l-0.016-0.008zM5.181 29.041h-2.383v-10.709h2.383zM28.719 22.541c-0.412 0.37-0.86 0.729-1.328 1.062l-0.047 0.032c-1.143 0.826-2.418 1.65-4.014 2.596-0.348 0.205-0.691 0.418-1.037 0.631-0.854 0.573-1.837 1.12-2.864 1.586l-0.13 0.053c-1.152 0.474-2.49 0.748-3.892 0.748-1.203 0-2.359-0.203-3.436-0.575l0.074 0.022c-1.555-0.648-3.363-1.145-5.248-1.407l-0.117-0.013v-7.436h2.062l4.76 1.395c0.062 0.020 0.133 0.031 0.207 0.031 0.001 0 0.003 0 0.004 0h3.89c0.883 0 1.197 0.521 1.197 0.969s-0.314 0.969-1.197 0.969h-6.809c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h7.781c0.001 0 0.003 0 0.004 0 0.11 0 0.214-0.024 0.307-0.068l-0.004 0.002 7.795-3.5c0.288-0.132 0.625-0.209 0.98-0.209 0.265 0 0.52 0.043 0.758 0.122l-0.017-0.005c0.383 0.23 0.658 0.604 0.752 1.046l0.002 0.011c-0.136 0.159-0.278 0.302-0.429 0.435l-0.005 0.004zM29.951 1.506h-3.883c-0.414 0-0.75 0.336-0.75 0.75v0 1.011c-1.814-0.279-3.443-0.74-4.981-1.374l0.143 0.052c-1.159-0.415-2.496-0.654-3.89-0.654-1.606 0-3.138 0.319-4.536 0.896l0.079-0.029c-1.242 0.552-2.297 1.136-3.295 1.8l0.081-0.051c-0.337 0.208-0.674 0.417-1.014 0.618-1.646 0.975-2.958 1.823-4.127 2.671-0.576 0.408-1.078 0.812-1.555 1.244l0.014-0.012c-0.377 0.304-0.678 0.686-0.882 1.123l-0.008 0.019c-0.032 0.081-0.051 0.175-0.051 0.273 0 0.056 0.006 0.11 0.017 0.162l-0.001-0.005c0.147 1.016 0.756 1.864 1.604 2.336l0.016 0.008c0.377 0.186 0.82 0.295 1.289 0.295 0.013 0 0.026-0 0.039-0l-0.002 0c0.612-0.008 1.191-0.142 1.715-0.377l-0.027 0.011 5.778-2.597c-0.003 0.047-0.026 0.088-0.026 0.135 0.014 1.371 1.129 2.477 2.502 2.477 0.069 0 0.136-0.003 0.204-0.008l-0.009 0.001h3.783l4.76 1.395c0.062 0.019 0.134 0.030 0.208 0.030 0.001 0 0.002 0 0.003 0h2.168v0.757c0 0.414 0.336 0.75 0.75 0.75h3.883c0.414-0 0.75-0.336 0.75-0.75v0-12.207c-0-0.414-0.336-0.75-0.75-0.75v0zM23.258 12.206l-4.76-1.394c-0.062-0.019-0.134-0.030-0.208-0.030-0.001 0-0.002 0-0.003 0h-3.89c-0.883 0-1.196-0.522-1.196-0.97s0.313-0.97 1.196-0.97h6.809c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0h-7.782c-0.111 0-0.217 0.024-0.312 0.067l0.005-0.002-7.793 3.503c-0.287 0.132-0.624 0.21-0.978 0.21-0.266 0-0.522-0.043-0.76-0.124l0.017 0.005c-0.382-0.229-0.657-0.604-0.751-1.045l-0.002-0.011c0.136-0.159 0.278-0.303 0.431-0.435l0.005-0.004c0.413-0.373 0.861-0.732 1.33-1.063l0.045-0.030c1.132-0.821 2.407-1.646 4.013-2.596 0.348-0.207 0.693-0.421 1.038-0.634 0.854-0.573 1.836-1.119 2.864-1.583l0.129-0.052c1.153-0.474 2.491-0.75 3.894-0.75 1.202 0 2.357 0.202 3.433 0.575l-0.074-0.022c1.554 0.647 3.362 1.145 5.245 1.409l0.118 0.014v7.434zM29.201 13.713h-2.383v-10.707h2.383z"></path> </g></svg>
        ),
        label: "Irradiação Geral",
        route: "/dashboard",
      },
      {
        icon: (
          <svg className="fill-current" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="-3.14 -3.14 37.64 37.64" xmlSpace="preserve" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.125428"></g><g id="SVGRepo_iconCarrier"> <g> <g>
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
      route: "/sessoes",
      icon: (<svg className="fill-current" width="18px" height="18px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>group</title> <g id="Page-1" stroke="none" stroke-width="1" > <g id="icon" transform="translate(64.000000, 64.000000)"> <path d="M106.666667,1.42108547e-14 L106.666667,42.6666667 L42.6666667,42.6666667 L42.6666667,341.333333 L106.666667,341.333333 L106.666667,384 L1.42108547e-14,384 L1.42108547e-14,1.42108547e-14 L106.666667,1.42108547e-14 Z M384,1.42108547e-14 L384,384 L277.333333,384 L277.333333,341.333333 L341.333333,341.333333 L341.333333,42.6666667 L277.333333,42.6666667 L277.333333,1.42108547e-14 L384,1.42108547e-14 Z M298.666667,256 L298.666667,298.666667 L85.3333333,298.666667 L85.3333333,256 L298.666667,256 Z M298.666667,170.666667 L298.666667,213.333333 L85.3333333,213.333333 L85.3333333,170.666667 L298.666667,170.666667 Z M298.666667,85.3333333 L298.666667,128 L85.3333333,128 L85.3333333,85.3333333 L298.666667,85.3333333 Z" id="Combined-Shape"> </path> </g> </g> </g></svg>)
    }]
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
          <Link href="/dashboard">
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
