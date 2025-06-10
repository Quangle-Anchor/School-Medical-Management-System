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

const navigation = [
  { name: "Dashboard", href: "/" },
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
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginState = async () => {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");
      if (!token || !storedRole) {
        setIsLoggedIn(false);
        return;
      }
      try {
        await axios.get('/api/auth/validate-token', {
    headers: { Authorization: `Bearer ${token}` },
});
        setIsLoggedIn(true);
        setRole(storedRole);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
      }
    };
    checkLoginState();
  }, []);

  useEffect(() => {
    if (!role) return;
    switch (role) {
       case "Manager": navigate("/manager-dashboard", { replace: true }); break;
      case "Admin":
        navigate("/AdminDashboard");
        break;
      case "Nurse":
        navigate("/NurseDashboard");
        break;
      case "Parent":
        navigate("/ParentDashboard");
        break;
      case "Student":
        navigate("/StudentDashboard");
        break;
      default:
        navigate("/");
    }
  }, [role, navigate]);

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
setIsLoggedIn(false);
 setRole(null);
  navigate("/login");
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
              {navigation.map((item) => (
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
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none">
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                    className="h-8 w-8 rounded-full"
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
