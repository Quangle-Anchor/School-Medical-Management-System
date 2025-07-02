import { useState, useEffect, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import logo from '../assets/img/2.png';
import authApi from '../api/authApi';

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
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'role' || e.key === 'email' || e.key === 'fullname') {
        checkAuthStatus();
      }
    };
    
    // Also listen for custom events from login/logout
    const handleAuthChange = () => {
      console.log('Auth change event detected'); // Debug log
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      console.log('Checking auth status:', { token: !!token, role }); // Debug log
      
      if (token && role) {
        try {
          // Validate token and get current user from backend
          const isValidToken = await authApi.validateToken();
          
          if (isValidToken) {
            // Fetch current user profile from backend
            const userProfile = await authApi.getCurrentUser();
            
            console.log('Fetched user profile from backend:', userProfile); // Debug log
            
            // Create user object from backend response
            const userData = {
              id: userProfile.userId,
              name: userProfile.fullName || userProfile.username || 'User',
              email: userProfile.email,
              phone: userProfile.phone,
              username: userProfile.username,
              role: userProfile.role,
            };
            
            console.log('Setting authenticated user:', userData); // Debug log
            setIsAuthenticated(true);
            setUser(userData);
          } else {
            // Token is invalid, clear auth state
            console.log('Token validation failed, clearing auth state'); // Debug log
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('userId');
            localStorage.removeItem('email');
            localStorage.removeItem('fullname');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Error validating token or fetching user:', error);
          // If API call fails, fall back to stored data but with a warning
          const email = localStorage.getItem('email');
          const userId = localStorage.getItem('userId');
          const fullname = localStorage.getItem('fullname');
          
          const userData = {
            id: userId || 1,
            name: fullname || (role === 'Parent' ? 'Parent User' : 
                  role === 'Admin' ? 'Admin User' :
                  role === 'Nurse' ? 'Nurse User' :
                  role === 'Principal' ? 'Principal User' :
                  role === 'Student' ? 'Student User' : 'User'),
            email: email || `${role.toLowerCase()}@medcare.com`,
            role: role,
            avatar: null
          };
          
          console.log('API failed, using stored data:', userData); // Debug log
          setIsAuthenticated(true);
          setUser(userData);
        }
      } else {
        console.log('No token or role found, setting unauthenticated'); // Debug log
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

  const handleLogin = () => {
    // Navigate to login page instead of mock login
    navigate('/login');
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('fullname');
    
    // Clear state
    setIsAuthenticated(false);
    setUser(null);
    
    // Dispatch custom event to notify other components of logout
    window.dispatchEvent(new CustomEvent('authChange'));
    
    // Navigate to home page
    navigate('/');
  };

  // Role-based navigation
  const getRoleBasedNavigation = (role) => {
    const baseNavigation = [
      { name: 'Home', href: '/home' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },     
    ];

    const roleSpecificNavigation = {
      Principal: [
        { name: 'Principal Dashboard', href: '/principalDashboard' },
        ...baseNavigation,
      ],
      Admin: [
        { name: 'Admin Dashboard', href: '/adminDashboard' },
        ...baseNavigation,
      ],
      Nurse: [
        { name: 'Nurse Dashboard', href: '/nurseDashboard' },
        ...baseNavigation,
      ],
      Parent: [
        { name: 'Parent Dashboard', href: '/parentDashboard' },
        ...baseNavigation,
      ],
      Student: [
        { name: 'Student Dashboard', href: '/studentDashboard' },
        ...baseNavigation,
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
      ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };  if (loading) {
    return (      <nav className="backdrop-blur-lg bg-white/10 border-b border-white/20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="animate-pulse flex space-x-4">
              <div className="h-10 w-10 bg-white/20 rounded-lg backdrop-blur-sm"></div>
              <div className="h-6 w-24 bg-white/10 rounded backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </nav>
    );  }    return (
    <nav className="backdrop-blur-lg bg-white/10 border-b border-white/20 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
            <div className="flex items-center">              <Link to="/" className="flex items-center space-x-3 text-white hover:text-white/80 transition-colors duration-200">
                <div className="inline-block p-2 bg-white/20 rounded-full backdrop-blur-sm shadow-lg">
                  <img  
                    alt="SVXS Logo" 
                    src={logo} 
                    className="h-8 w-8 rounded-full object-cover shadow-lg" 
                  />
                </div>                <div className="flex flex-col">
                  <span className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text drop-shadow-2xl">
                    SVXS
                  </span>
                  <span className="text-xs text-transparent bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text font-medium drop-shadow-lg">
                    School Medical
                  </span>
                </div>
              </Link>
            </div>

          {/* Navigation */}
          <div className="flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}                className={classNames(
                  isActive(item.href)
                    ? 'bg-white/15 text-blue-500 font-semibold shadow-inner backdrop-blur-sm border border-white/30'
                    : 'text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text hover:bg-white/10 hover:text-transparent hover:from-blue-500 hover:to-purple-600 hover:backdrop-blur-sm hover:border hover:border-white/20',
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-inner'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Menu as="div" className="relative">
                <div>                  <Menu.Button className="flex items-center space-x-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded-xl p-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15">
                    {user?.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover border border-white/30"
                        src={user.avatar}
                        alt={user.name}
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-blue-400" />
                    )}
                    <div className="text-left">
                      <div className="text-sm font-medium text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
                        {user?.name || user?.username}
                      </div>
                      <div className="text-xs bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm border border-white/20 text-transparent bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text">
                        {user?.role}
                      </div>
                    </div>
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
                >                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl focus:outline-none border border-white/20">
                    <div className="p-2">                      <div className="px-3 py-2 border-b border-white/20">
                        <p className="text-sm font-medium text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">{user?.name}</p>
                        <p className="text-sm text-transparent bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text">{user?.email}</p>
                        {user?.username && (
                          <p className="text-xs text-transparent bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text">@{user.username}</p>
                        )}
                        {user?.phone && (
                          <p className="text-xs text-transparent bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text">{user.phone}</p>
                        )}
                        <span className="inline-block mt-1 text-xs bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm border border-white/20 text-transparent bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text">
                          {user?.role}
                        </span>
                      </div><Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"                            className={classNames(
                              active ? 'bg-white/15 backdrop-blur-sm' : 'hover:bg-white/5',
                              'group flex items-center px-3 py-2 text-sm rounded-xl mt-2 transition-all duration-300'
                            )}                          >
                            <UserIcon className="mr-3 h-4 w-4 text-blue-400" />
                            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">Profile</span>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/settings"                            className={classNames(
                              active ? 'bg-white/15 backdrop-blur-sm' : 'hover:bg-white/5',
                              'group flex items-center px-3 py-2 text-sm rounded-xl transition-all duration-300'
                            )}                          >
                            <Cog6ToothIcon className="mr-3 h-4 w-4 text-purple-400" />
                            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">Settings</span>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}                            className={classNames(
                              active ? 'bg-red-500/20 backdrop-blur-sm' : 'hover:bg-red-500/10',
                              'group flex items-center w-full px-3 py-2 text-sm rounded-xl transition-all duration-300'
                            )}                          >
                            <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4 text-red-400" />
                            <span className="text-transparent bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text">Sign out</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLogin}
                  className="bg-white/10 hover:bg-white/15 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border border-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                >
                  <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">Sign In</span>
                </button>                <Link
                  to="/signup"
                  className="bg-white/10 hover:bg-white/15 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border border-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                >
                  <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">Sign Up</span>
                </Link>
              </div>)}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;
