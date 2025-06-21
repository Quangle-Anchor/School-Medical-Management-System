
import { useState, useEffect, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const AuthNavbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status on mount and storage changes
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');
      
      if (token && role) {
        // Validate token with API call (simulate for now)
        const isValidToken = await validateToken(token);
        
        if (isValidToken) {
          // Create user object from stored data
          const userData = {
            id: userId || 1,
            name: 'User', // You might want to store and retrieve actual user name
            email: 'user@medcare.com', // You might want to store and retrieve actual email
            role: role,
            avatar: null
          };
          
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('userId');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Simulate token validation (replace with actual API call)
  const validateToken = async (token) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // For demo purposes, consider token valid if it exists
      // Replace with actual API validation
      return token && token.length > 0;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };
  const handleLogin = () => {
    // Navigate to login page instead of mock login
    navigate('/login');
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };
  // Role-based navigation
  const getRoleBasedNavigation = (role) => {
    const baseNavigation = [
      { name: 'Home', href: '/home' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Calendar', href: '/calendar' },
    ];

    const roleSpecificNavigation = {
      Manager: [
        { name: 'Manager Dashboard', href: '/managerDashboard' },
        ...baseNavigation,
        { name: 'Reports', href: '/reports' },
        { name: 'Staff Management', href: '/staff' }
      ],
      Admin: [
        { name: 'Admin Dashboard', href: '/adminDashboard' },
        ...baseNavigation,
        { name: 'System Settings', href: '/settings' },
        { name: 'User Management', href: '/users' }
      ],
      Nurse: [
        { name: 'Nurse Dashboard', href: '/nurseDashboard' },
        ...baseNavigation,
        { name: 'Patient Care', href: '/patients' },
        { name: 'Schedule', href: '/schedule' }
      ],
      Parent: [
        { name: 'Parent Dashboard', href: '/parentDashboard' },
        ...baseNavigation,
        { name: 'Child Health', href: '/child-health' },
        { name: 'Appointments', href: '/appointments' }
      ],
      Student: [
        { name: 'Student Dashboard', href: '/studentDashboard' },
        ...baseNavigation,
        { name: 'Health Records', href: '/health-records' },
        { name: 'Wellness', href: '/wellness' }
      ]
    };

    return roleSpecificNavigation[role] || baseNavigation;
  };
  const navigation = isAuthenticated && user 
    ? getRoleBasedNavigation(user.role)
    : [
        { name: 'Home', href: '/home' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Calendar', href: '/calendar' },
      ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  if (loading) {
    return (
      <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-lg border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="animate-pulse flex space-x-4">
              <div className="h-10 w-10 bg-white/20 rounded-lg"></div>
              <div className="h-6 w-24 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <Disclosure as="nav" className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-lg border-b border-blue-500/20">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors duration-200">
                  <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <HeartIcon className="h-6 w-6 text-blue-100" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    MedCare
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      isActive(item.href)
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white',
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* User Menu / Auth Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                {isAuthenticated ? (
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg p-2">
                        {user?.avatar ? (
                          <img
                            className="h-8 w-8 rounded-full object-cover border-2 border-white/20"
                            src={user.avatar}
                            alt={user.name}
                          />
                        ) : (
                          <UserCircleIcon className="h-8 w-8" />
                        )}
                        <span className="text-sm font-medium">{user?.name}</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{user?.role}</span>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-xl ring-1 ring-black/5 focus:outline-none">
                        <div className="p-2">
                          <div className="px-3 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile"
                                className={classNames(
                                  active ? 'bg-blue-50 text-blue-600' : 'text-gray-700',
                                  'group flex items-center px-3 py-2 text-sm rounded-md mt-2'
                                )}
                              >
                                <UserIcon className="mr-3 h-4 w-4" />
                                Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/settings"
                                className={classNames(
                                  active ? 'bg-blue-50 text-blue-600' : 'text-gray-700',
                                  'group flex items-center px-3 py-2 text-sm rounded-md'
                                )}
                              >
                                <Cog6ToothIcon className="mr-3 h-4 w-4" />
                                Settings
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={classNames(
                                  active ? 'bg-red-50 text-red-600' : 'text-gray-700',
                                  'group flex items-center w-full px-3 py-2 text-sm rounded-md'
                                )}
                              >
                                <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleLogin}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white/20 backdrop-blur-sm"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={handleLogin}
                      className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <Disclosure.Button className="text-white hover:bg-white/10 hover:text-white p-2 rounded-lg transition-colors duration-200">
                  {open ? (
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-800/50 backdrop-blur-sm">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    isActive(item.href)
                      ? 'bg-white/20 text-white border-white/30'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white border-transparent',
                    'block px-3 py-2 rounded-md text-base font-medium border transition-all duration-200'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 pb-3 border-t border-white/20">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        {user?.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover border-2 border-white/20"
                            src={user.avatar}
                            alt={user.name}
                          />
                        ) : (
                          <UserCircleIcon className="h-10 w-10 text-white" />
                        )}
                        <div>
                          <div className="text-base font-medium text-white">{user?.name}</div>
                          <div className="text-sm text-blue-100">{user?.email}</div>
                          <div className="text-xs bg-white/20 px-2 py-1 rounded-full inline-block mt-1 text-white">
                            {user?.role}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Disclosure.Button
                      as={Link}
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      Profile
                    </Disclosure.Button>
                    <Disclosure.Button
                      as={Link}
                      to="/settings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      Settings
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Disclosure.Button
                      as="button"
                      onClick={handleLogin}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      Sign In
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      onClick={handleLogin}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-white text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                    >
                      Sign Up
                    </Disclosure.Button>
                  </div>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
export default AuthNavbar;
