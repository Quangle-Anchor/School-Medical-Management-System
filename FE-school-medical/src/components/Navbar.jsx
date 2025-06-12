import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/img/logoxoanen.png";
import avatar from "../assets/img/avatarDefault.png";
const navigation = [
  { name: "Home", href: "/home" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Calendar", href: "/calendar" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [userAvatar, setUserAvatar] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginState = async () => {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");
      if (!token || !storedRole) {
        setIsLoggedIn(false);
        setRole(null);
        setUserAvatar("");
        return;
      }
      try {
        await axios.get('/api/auth/validate-token', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsLoggedIn(true);
        setRole(storedRole);
        // Fetch user info (replace with your actual API endpoint)
        const userRes = await axios.get('/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserAvatar(userRes.data.avatarUrl || "");
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setRole(null);
        setUserAvatar("");
      }
    };

    // Check login state on initial render
    checkLoginState();

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      checkLoginState();
    };
    window.addEventListener('storage', handleStorageChange);

    // Listen for login/logout events in the same tab
    const origSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      origSetItem.apply(this, arguments);
      window.dispatchEvent(new Event('storage'));
    };

    // Cleanup event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = origSetItem;
    };
  }, []);

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  setIsLoggedIn(false);
  setRole(null);
  navigate("/login");
};

const getNavigation = () => {
  if (!isLoggedIn || !role) {
    return [
      { name: "Home", href: "/home" },
      { name: "About", href: "/about" },
      { name: "Projects", href: "/projects" },
      { name: "Calendar", href: "/calendar" },
    ];
  }
  const dashboardMap = {
    Manager: { name: "Manager Dashboard", href: "/managerDashboard" },
    Admin: { name: "Admin Dashboard", href: "/adminDashboard" },
    Nurse: { name: "Nurse Dashboard", href: "/nurseDashboard" },
    Parent: { name: "Parent Dashboard", href: "/parentDashboard" },
    Student: { name: "Student Dashboard", href: "/studentDashboard" },
  };
  const dashboard = dashboardMap[role] || { name: "Dashboard", href: "/" };
  return [
    dashboard,
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Calendar", href: "/calendar" },
  ];
};

  return (
    <Disclosure as="nav" className="bg-blue-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <img alt="Logo" src={logo} className="h-12 w-auto" />
          </div>

          {/* Nav Links */}
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              {getNavigation().map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "bg-white text-blue-500"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* User / Login */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {!isLoggedIn ? (
              <button
                onClick={() => navigate("/login")}
                className="mr-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              >
                Login
              </button>
            ) : (
              <Menu as="div" className="relative ml-3">
                <MenuButton className="relative flex rounded-full text-sm ">
                  <img
                    alt="avatar"
                    src={userAvatar && userAvatar.trim() !== "" ? userAvatar : avatar}
                    onError={e => { e.target.onerror = null; e.target.src = avatar; }}
                    className="h-8 w-8 rounded-full border-5 border-white"
                    style={{ boxShadow: 'none', outline: 'none', borderColor: 'white' }}
                  />
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
