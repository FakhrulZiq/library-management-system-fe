"use client";
import { useAuth } from "@/context/authContext";
import {
  BookCheck,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  UserCog,
  Users,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const { logout, role, email, name } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(pathname);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Books",
      path: "/book",
      icon: <BookOpen size={20} />,
    },
    {
      name: "Borrowed Book",
      path: "/return-book",
      icon: <BookCheck size={20} />,
      roles: ["student"],
    },
    {
      name: "Borrowed Book",
      path: "/borrowed-book",
      icon: <BookCheck size={20} />,
      roles: ["admin", "librarian"],
    },
    {
      name: "Students",
      path: "/students",
      icon: <Users size={20} />,
      roles: ["admin", "librarian"],
    },
    {
      name: "Staff",
      path: "/staff",
      icon: <UserCog size={20} />,
      roles: ["admin"],
    },
    {
      name: "Add User",
      path: "/register-user",
      icon: <UserCog size={20} />,
      roles: ["admin"],
    },
    {
      name: "Add Book",
      path: "/add-book",
      icon: <UserCog size={20} />,
      roles: ["admin", "librarian"],
    },
  ].filter((item) => {
    return !item.roles || item.roles.includes(role);
  });

  const handleNavigation = (path: string) => {
    setActiveItem(path);
    router.push(path);
  };

  return (
    <aside
      className={`h-screen bg-indigo-800 text-white flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      <div className="p-4">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          } mb-8`}
        >
          {!collapsed && (
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>📘</span>
              <span>Library</span>
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-full hover:bg-indigo-700"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                activeItem === item.path
                  ? "bg-indigo-700"
                  : "hover:bg-indigo-600"
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-indigo-700">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          } mb-4`}
        >
          <div className="flex items-center">
            <Image
              src="/image/me.png"
              alt="admin"
              width={40}
              height={40}
              className="rounded-full"
            />
            {!collapsed && (
              <div className="ml-3">
                <p className="font-medium">{name}</p>
                <p className="text-xs text-indigo-300">{email}</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={logout}
          className={`flex items-center w-full p-2 rounded-lg hover:bg-red-700 transition-colors text-white ${
            collapsed ? "justify-center" : "justify-start"
          }`}
        >
          <div className="flex items-center gap-2">
            <LogOut size={20} className="text-white" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </div>
        </button>
      </div>
    </aside>
  );
}
