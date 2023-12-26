// Header.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/footboolia.png';
import profileImage from '../img/avatars.webp';

function Header() {
  const [scrolling, setScrolling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!document.cookie.match(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/)); // Set initial state based on the presence of the token
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    setScrolling(window.scrollY > 50);

    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Check if the user is logged in from localStorage
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(storedLoggedIn === 'true');

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    console.log('Logging out');

    // Clear the authToken cookie
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Clear authentication state in local storage
    localStorage.removeItem('isLoggedIn');

    // Update the local state to indicate that the user is no longer logged in
    setIsLoggedIn(false);

    // Close the profile dropdown
    setProfileDropdownOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setProfileDropdownOpen(false);
  };

  return (
    <div>
      <header
        className={`fixed top-0 w-full border-b shadow-lg border-b-1 z-10 border-slate-200 shadow-slate-700/5 ${
          scrolling ? 'bg-white/95' : 'bg-white/40'
        } ${menuOpen ? 'after:absolute after:top-full after:left-0 z-[10] after:block after:h-px after:w-full after:bg-slate-200 lg:border-slate-200 lg:backdrop-blur-sm lg:after:hidden' : ''}`}
      >
        <div className="relative mx-auto max-w-full px-6 lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[96rem] z-[100]">
          <nav aria-label="main navigation" className="flex h-[5.5rem] items-stretch justify-between font-medium text-slate-700">
            <Link to="/profile1">
              <img src={logo} alt="Logo" className="h-20" />
            </Link>
            <button className="lg:hidden focus:outline-none" onClick={toggleMenu}>
              <div className="flex flex-col h-6 w-6">
                <div
                  className={`h-1 w-6 mb-1 transition-all duration-300 ${
                    menuOpen ? 'transform rotate-45 translate-y-2' : ''
                  }`}
                  style={{ backgroundColor: menuOpen ? '#22C55E' : '#374151' }}
                ></div>
                <div
                  className={`h-1 w-6 mb-1 transition-all duration-300 ${
                    menuOpen ? 'opacity-0' : ''
                  }`}
                  style={{ backgroundColor: menuOpen ? 'transparent' : '#374151' }}
                ></div>
                <div
                  className={`h-1 w-6 mb-1 transition-all duration-300 ${
                    menuOpen ? 'transform -rotate-45 -translate-y-2' : ''
                  }`}
                  style={{ backgroundColor: menuOpen ? '#22C55E' : '#374151' }}
                ></div>
              </div>
            </button>

            <ul
  role="menubar"
  aria-label="Select page"
  className={`font-medium ${
    menuOpen
      ? 'flex flex-col items-center mt-4 space-y-4'
      : 'hidden lg:flex lg:items-stretch'
  }`}
  onClick={closeMenu}
>
  <li role="none" className="flex items-stretch">
    <Link
      role="menuitem"
      aria-haspopup="false"
      className="flex items-center gap-2 py-2 lg:py-4 transition-colors duration-300 hover:text-emerald-500 focus:text-emerald-600 focus:outline-none focus-visible:outline-none lg:px-4"
      to="/"
    >
      <span>Home</span>
    </Link>
  </li>
  <li role="none" className="flex items-stretch">
    <Link
      role="menuitem"
      aria-current="page"
      aria-haspopup="false"
      className="flex items-center gap-2 py-2 lg:py-4 transition-colors duration-300 hover:text-emerald-600 focus:text-emerald-600 focus:outline-none focus-visible:outline-none lg:px-4"
      to="/playgrounds"
    >
      <span>Playgrounds</span>
    </Link>
  </li>
  <li role="none" className="flex items-stretch">
    <Link
      role="menuitem"
      aria-haspopup="false"
      className="flex items-center gap-2 py-2 lg:py-4 transition-colors duration-300 hover:text-emerald-500 focus:text-emerald-600 focus:outline-none focus-visible:outline-none lg:px-4"
      to="/academies"
    >
      <span>Academies</span>
    </Link>
  </li>
  <li role="none" className="flex items-stretch">
    <Link
      role="menuitem"
      aria-haspopup="false"
      className="flex items-center gap-2 py-2 lg:py-4 transition-colors duration-300 hover:text-emerald-500 focus:text-emerald-600 focus:outline-none focus-visible:outline-none lg:px-4"
      to="/store"
    >
      <span>Store</span>
    </Link>
  </li>
</ul>


            <div className="flex items-center px-6 ml-auto lg:ml-0 lg:p-0">
              {isLoggedIn ? (
                <div className="flex items-center relative">
                  <div onClick={toggleProfileDropdown}>
                    <img src={profileImage} className="w-8 h-8 rounded-full shadow-lg cursor-pointer" alt="Profile" />
                  </div>
                  {profileDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-emerald-200 rounded-lg shadow-lg">
                      <Link to="/profile" className="block w-full text-left px-4 py-2 hover:bg-emerald-100">
                        Profile
                      </Link>
                      <Link to="/">
                        <button className="block w-full text-left px-4 py-2 hover:bg-slate-100" onClick={handleLogout}>
                          Logout
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <button className="inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded shadow-md whitespace-nowrap bg-emerald-500 shadow-emerald-200 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none">
                    <span>Login / Sign up</span>
                  </button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Header;
