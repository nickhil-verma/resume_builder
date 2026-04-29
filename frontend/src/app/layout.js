'use client';
import { Instrument_Serif, DM_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const instrumentSerif = Instrument_Serif({ 
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument',
});

const dmSans = DM_Sans({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/resume') || pathname.startsWith('/chat') || pathname.startsWith('/jobs') || pathname.startsWith('/settings');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <html lang="en">
        <body className={dmSans.className}></body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${instrumentSerif.variable} ${dmSans.variable}`}>
      <body className={`${dmSans.className} bg-[#f5f2ed] text-[#2d2d2d]`}>
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#2d2d2d',
              border: '1px solid #e5e7eb',
            }
          }}
        />
        {!isDashboard && <Navbar />}
        <div className="flex min-h-screen">
          {isDashboard && <Sidebar />}
          <main className={`flex-1`}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
