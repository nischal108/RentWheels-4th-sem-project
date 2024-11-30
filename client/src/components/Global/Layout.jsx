import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div>
      <Navbar />      
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
