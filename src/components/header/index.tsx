// components/Header.tsx
'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/data/redux/Store';
import { setUserProfile } from '@/data/redux/slices/authSlice';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import Link from 'next/link'; // Import Link from next/link

import logo from '@/assets/images/smartroll.png';  // Assuming you're using a Next.js alias for assets
import { DecodedToken } from '@/types/common';

const Header = () => {
  const dispatch = useDispatch();
  const access: any = useSelector((state: RootState) => state.auth.accessToken);

  const [profile, setProfile] = useState<DecodedToken | null>(null);

  const decodeToken = () => {
    try {
      if (access) {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(access);
        dispatch(setUserProfile(decoded));
        setProfile(decoded);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    decodeToken();
  }, [access]);

  return (
    <header className="header-top relative flex w-full items-center justify-center bg-[#F7F7F7] px-4 py-3 shadow-md md:px-10">
      {/* Logo on far left */}
      <div className="h-8">
        <Link href="/">          
            <Image
              src={logo}
              alt="Smart Roll Logo"
              width={112} // Desired width for the logo
              height={28} // Desired height for the logo
              className="object-contain" // Image optimization with Next.js
            />          
        </Link>
      </div>

      {/* Spacer to push avatar right only on desktop */}

      {/* Avatar + Role Icon */}
      {profile?.obj?.profile?.name && (
        <>
      <div className="hidden flex-1 md:block" />
        <div className="flex items-center gap-2 md:ml-auto">
          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-sm">
            {profile.obj.profile.role === 'teacher'
              ? profile.obj.teacher_code?.substring(0, 2).toUpperCase()
              : profile.obj.profile.name
                  ?.split(' ')
                  .map((word) => word[0].toUpperCase())
                  .join('')}
          </div>
        </div>
        </>
      )}
    </header>
  );
};

export default Header;
