import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, User, ChevronDown } from 'lucide-react';

const TopNavbar = ({ 
  title = "Dashboard", 
  breadcrumb = ["Pages", "Dashboard"],
  userInfo = { name: "Richard Davis", avatar: null }
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    // Clear user session data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('fullname');
    // Navigate to login page
    navigate('/login');
  };

  return (
    <nav className="relative flex items-center justify-between px-6 py-3 mx-6 bg-white shadow-sm rounded-2xl transition-all ease-soft-in border border-gray-100">
      <div className="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">
        {/* Left side - Breadcrumb */}
        <nav className="flex" aria-label="breadcrumb">
          <ol className="flex flex-wrap pt-1 mr-12 bg-transparent rounded-lg sm:mr-16">
            <li className="text-sm leading-normal">
              <span className="opacity-50 text-slate-700">{breadcrumb[0]}</span>
              <span className="text-slate-700 mx-2">/</span>
            </li>
            <li className="text-sm font-semibold leading-normal text-slate-700" aria-current="page">
              {breadcrumb[1]}
            </li>
          </ol>
        </nav>

        {/* Right side - Search, Notifications, Settings, Profile */}
        <div className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">
          <div className="flex items-center md:ml-auto md:pr-4">
          </div>
          {/* Navigation Icons */}
          <ul className="flex flex-row justify-end pl-0 mb-0 list-none md-max:w-full">
            {/* Mobile Menu Toggle */}

            {/* Notifications */}
            <li className="flex items-center px-4">
              <button className="block p-2 transition-all ease-nav-brand text-sm text-slate-500 bg-white shadow rounded-lg hover:bg-gray-50 ring-1 ring-sky-200 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  5
                </span>
              </button>
            </li>

            {/* Profile Dropdown */}
            <li className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center px-4 py-2 text-sm transition-all ease-nav-brand text-slate-500 hover:text-slate-700 bg-white shadow rounded-lg hover:bg-gray-50 ring-1 ring-sky-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-500 flex items-center justify-center mr-2">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="hidden sm:flex sm:flex-col">
                    <span className="text-sm font-medium">{userInfo.name}</span>
                    <span className="text-xs text-gray-500">INNOVATIVE SCHOOL HEALTH SOLUTIONS</span>
                  </div>
                  <ChevronDown size={16} className="ml-1" />
                </button>
                
                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md border border-gray-200 z-50">
                    <div className="py-1">
                      <button 
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Profile
                      </button>
                      <hr className="my-1" />
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
