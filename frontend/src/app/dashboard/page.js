'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import ResumeCard from '@/components/ResumeCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [resumes, setResumes] = useState([]);
  const [resumeCount, setResumeCount] = useState(0);
  const [socials, setSocials] = useState({ linkedin: '', github: '', codeforces: '', leetcode: '' });
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [resumesRes, countRes, socialsRes, profileRes] = await Promise.all([
        api.get('/resume'),
        api.get('/resume/count'),
        api.get('/user/social'),
        api.get('/user/profile')
      ]);
      setResumes(resumesRes.data);
      setResumeCount(countRes.data.count);
      setSocials(socialsRes.data);
      setProfile(profileRes.data);

      if (!profileRes.data.name || !profileRes.data.email) {
        router.push('/onboarding');
      }
    } catch (error) {
      toast.error('Failed to sync dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/resume/${id}`);
      setResumes(resumes.filter(r => r.id !== id));
      setResumeCount(prev => prev - 1);
      toast.success('Resume deleted');
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  return (
    <div className="w-full h-full p-12 overflow-y-auto">
        <div className="max-w-6xl">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <div>
              <div className="text-[10px] font-black text-[#8b5e34] uppercase tracking-[0.4em] mb-3">Workspace — v2.0</div>
              <h1 className="text-5xl font-bold text-[#2d2d2d] font-heading tracking-tighter">
                Welcome back, {profile?.name?.split(' ')[0] || 'User'}
              </h1>
              <p className="text-[#737373] text-lg font-medium mt-2">Precision engineered career management</p>
            </div>
            <Link href="/resume/create" className="btn-primary px-12 py-5 text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-[#8b5e34]/30 hover:scale-[1.02] transition-transform">
              Create New Resume
            </Link>
          </header>

          {/* Stats & Socials Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
            {/* Resume Count */}
            <div className="bg-white border border-[#e5e0d8] p-10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-[0.2em] mb-6">Total Documents</div>
              <div className="flex items-end gap-3">
                <span className="text-6xl font-bold text-[#2d2d2d] font-heading leading-none tabular-nums">{resumeCount}</span>
                <span className="text-[#a3a3a3] text-[10px] font-black pb-1 uppercase tracking-widest">Saved</span>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="lg:col-span-3 bg-white border border-[#e5e0d8] p-10 rounded-2xl shadow-sm">
              <div className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-[0.2em] mb-6">Professional Network Integrations</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: 'GitHub', value: socials.github, icon: '⚡' },
                  { label: 'LinkedIn', value: socials.linkedin, icon: '🔗' },
                  { label: 'Codeforces', value: socials.codeforces, icon: '🏆' },
                  { label: 'LeetCode', value: socials.leetcode, icon: '🧠' }
                ].map(social => (
                  <div key={social.label}>
                    <div className="text-[9px] font-black text-[#8b5e34] uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span>{social.icon}</span> {social.label}
                    </div>
                    <div className={`text-sm font-bold truncate ${social.value ? 'text-[#2d2d2d]' : 'text-[#a3a3a3] italic font-medium'}`}>
                      {social.value || 'Not added'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumes Grid */}
          <section>
            <div className="flex items-center justify-between mb-12 pb-6 border-b border-[#e5e0d8]">
              <h2 className="text-2xl font-bold text-[#2d2d2d] font-heading tracking-tight uppercase">Recent Documents</h2>
              <div className="h-1 flex-1 mx-8 bg-[#fdfbf9] rounded-full" />
              <Link href="/resume/create" className="text-[10px] font-black text-[#8b5e34] hover:underline uppercase tracking-widest">Initialize New</Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-white border border-[#e5e0d8] rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : resumes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {resumes.map(resume => (
                  <Link key={resume.id} href={`/resumecompiler?id=${resume.id}`}>
                    <ResumeCard 
                      resume={resume} 
                      onDelete={(e) => { e.preventDefault(); handleDelete(resume.id); }}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#e5e0d8] rounded-3xl p-32 text-center shadow-sm">
                <div className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-[0.4em] mb-8 opacity-40 italic">Null State — No Data</div>
                <h3 className="text-4xl font-bold text-[#2d2d2d] font-heading mb-6 tracking-tight">Your Portfolio is Empty</h3>
                <p className="text-[#737373] text-lg mb-12 max-w-lg mx-auto font-medium leading-relaxed">
                  Start your journey by creating a high-performance resume tailored for your next career milestone.
                </p>
                <Link href="/resume/create" className="btn-primary px-16 py-5 text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-[#8b5e34]/30">
                  Create First Resume
                </Link>
              </div>
            )}
          </section>
        </div>
    </div>
  );
}
