'use client'

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation'; // Use Next.js router instead of react-router-dom
import { setAuth } from '@/data/redux/slices/authSlice';
import { setClassRoomList } from '@/data/redux/slices/classRoomsSlice';
import { Home, LogOut, UserPen } from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';
import useSidebarLinkSelector from './hooks/useSidebarLinkSelector';
import StackholderProfile from '@/components/stackholder/StackholderProfile';
import Link from 'next/link'; // Use Link from next/link for Next.js navigation

const Sidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter(); // Using Next.js useRouter for navigation

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('callbackUrl');
    localStorage.removeItem('fromApp');
    localStorage.removeItem('persist:root');
    localStorage.clear();
    
    // Clear Redux state
    dispatch(setClassRoomList({ isalreadyLoaded: false, classes: [] }));
    dispatch(setAuth({ access: '', refresh: '', isAuth: false }));
    
    // Redirect to login page
    router.push('/');
  };

  const {
    activeIndex,
    isProfileModalOpen,
    setActiveIndex,
    setIsProfileModalOpen,
  } = useSidebarLinkSelector();

  const menuItems = [
    {
      icon: Home,
      label: 'Home',
      event: () => router.push('/'), // Using Next.js routing
    },
    {
      icon: UserPen,
      label: 'Profile',
      event: () => {
        setIsProfileModalOpen(true);
      },
    },
    { icon: LogOut, label: 'Logout', event: handleLogout, alert: false },
  ];

  return (
    <div className="menu fixed bottom-4 left-0 right-0 flex justify-center">
      <div className="flex items-center gap-1 rounded-[12px] border border-zinc-700 bg-[#F7F7F7] p-1 shadow-soft backdrop-blur-lg transition-transform duration-300 ease-in-out hover:scale-105">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className="group relative flex h-11 w-11 items-center justify-center rounded-md text-black transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onClick={() => item.event()}
            aria-label={item.label}
          >
            <item.icon className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover:scale-110" />
            {activeIndex === index && (
              <span className="absolute -top-8 rounded-md bg-white px-2 py-1 text-xs opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
                {item.label}
              </span>
            )}
          </button>
        ))}
        <NotificationDrawer />
      </div>
      <StackholderProfile
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
