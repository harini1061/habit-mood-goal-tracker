import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../pages/Navbar'; // since Navbar is still in pages folder

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
