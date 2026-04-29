'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/resume') || pathname.startsWith('/chat')) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#f5f2ed]/80 backdrop-blur-md border-b border-[#e5e0d8]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[#8b5e34] flex items-center justify-center font-bold text-white shadow-md">
            R
          </div>
          <span className="text-2xl font-bold text-[#2d2d2d] font-heading tracking-tight">ResumeX</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-[#737373]">
          <Link href="/" className="hover:text-[#8b5e34] transition-colors">Home</Link>
          <Link href="/#features" className="hover:text-[#8b5e34] transition-colors">Features</Link>
          <Link href="/#pricing" className="hover:text-[#8b5e34] transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-5">
          {isLoggedIn ? (
            <div className="flex items-center gap-5">
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-[#737373] hover:text-[#2d2d2d] text-sm font-bold uppercase tracking-wider"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <Link href="/login" className="text-[#737373] hover:text-[#2d2d2d] text-sm font-bold uppercase tracking-wider">
                Login
              </Link>
              <Link href="/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
