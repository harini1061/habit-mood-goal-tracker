// src/pages/Navbar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  // Check if we are on the Home page
  const isHomePage = location.pathname === '/home';

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Only show title if not on Home page */}
          {!isHomePage && (
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">
                The Way of Alethea
              </h1>
            </div>
          )}

          {/* Navigation Links and Logout */}
          <div className="flex items-center">
            {/* Only show links if not on Home page */}
            {!isHomePage && (
              <>
                <Link 
                  to="/home" 
                  className="mx-6 text-white/90 hover:text-yellow-300 font-medium transition-colors duration-300"
                >
                  Home
                </Link>

                <Link 
                  to="/habits" 
                  className="mx-6 text-white/90 hover:text-yellow-300 font-medium transition-colors duration-300"
                >
                  Habits
                </Link>

                <Link 
                  to="/moods" 
                  className="mx-6 text-white/90 hover:text-yellow-300 font-medium transition-colors duration-300"
                >
                  Moods
                </Link>

                <Link 
                  to="/goals" 
                  className="mx-6 text-white/90 hover:text-yellow-300 font-medium transition-colors duration-300"
                >
                  Goals
                </Link>
              </>
            )}

            {/* Logout always visible */}
            <button 
              onClick={handleLogout} 
              className="ml-8 bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 hover:text-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
