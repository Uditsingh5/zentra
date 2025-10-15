import React from 'react';
import Sidebar from '../Sidebar';
import { Routes, Route } from 'react-router-dom';
import Home from '../../pages/Home.jsx';
import Explore from '../../pages/Explore.jsx';
import Notifications from '../../pages/Notifications.jsx';
import Profile from '../../pages/Profile.jsx';

const Layout = () => {
  return (
    <div className='flex h-screen w-full'>
      <Sidebar />
      <div className='flex-1 flex flex-col transition-all duration-300'>
        <main className='flex-1 overflow-y-auto bg-white'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/collab' element={<div>Collab</div>} />
            <Route path='/notification' element={<Notifications />} />
            <Route path='/search' element={<div>Search</div>} />
            <Route path='/settings' element={<div>Settings</div>} />
            <Route path='/logout' element={<div>Logout</div>} />
          </Routes>
        </main>
      </div>
      
    </div>
  );
};

export default Layout;