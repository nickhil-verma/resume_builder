'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import api from '@/lib/api';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Resumes', href: '/dashboard', icon: FileText },
  { label: 'Job Tracker', href: '/jobs', icon: Briefcase },
  { label: 'AI Chat', href: '/chat', icon: MessageSquare },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/user/profile');
        setUser(data);
      } catch (err) {}
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div
      className={`sticky top-0 h-screen bg-[#ffffff] border-r border-[#e5e0d8] z-40 hidden md:flex flex-col transition-all duration-300 shadow-sm flex-shrink-0 ${
        isCollapsed ? 'w-20' : 'w-[260px]'
      }`}
    >
      <div className="p-8 flex items-center justify-between border-b border-[#f5f2ed]">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#8b5e34] flex items-center justify-center font-bold text-white shadow-sm text-sm">
              R
            </div>
            <span className="font-bold text-xl text-[#2d2d2d] font-heading tracking-tight">ResumeX</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded bg-[#f5f2ed] hover:bg-[#e5e0d8] text-[#737373] transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href}>
              <div
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#8b5e34] text-white shadow-md' 
                    : 'text-[#737373] hover:bg-[#f5f2ed] hover:text-[#2d2d2d]'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon size={20} className={isCollapsed ? '' : 'mr-3'} />
                {!isCollapsed && (
                  <span className="font-semibold text-sm">{item.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-[#f5f2ed]">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[#f5f2ed] border border-[#e5e0d8] flex items-center justify-center text-[10px] font-black text-[#8b5e34]">
              {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#2d2d2d] truncate">{user.name}</p>
              <p className="text-[10px] font-bold text-[#a3a3a3] truncate uppercase tracking-tighter">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-4 py-3 rounded-lg text-[#737373] hover:text-red-500 hover:bg-red-50 transition-all duration-200 font-semibold text-sm ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} className={isCollapsed ? '' : 'mr-3'} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
