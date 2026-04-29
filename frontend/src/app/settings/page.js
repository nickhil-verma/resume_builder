'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function Settings() {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '', linkedinUrl: '', githubUrl: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/user/profile');
      setProfile({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        linkedinUrl: data.linkedinUrl || '',
        githubUrl: data.githubUrl || ''
      });
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/user/profile', profile);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full h-full p-10">
        <header className="mb-12">
          <div className="text-[10px] font-bold text-[#8b5e34] uppercase tracking-[0.3em] mb-3">System</div>
          <h1 className="text-4xl font-bold text-[#2d2d2d] font-heading tracking-tight">Account Settings</h1>
          <p className="text-[#737373] mt-2 font-medium">Manage your professional credentials and integrations</p>
        </header>

        <div className="max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Identity */}
            <div className="bg-white border border-[#e5e0d8] rounded-2xl p-8 shadow-sm">
              <h3 className="text-[10px] font-bold text-[#8b5e34] uppercase tracking-widest mb-6 border-b border-[#f5f2ed] pb-4">01 — Identity</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-[#737373] uppercase mb-2 block">Display Name</label>
                  <input 
                    className="input-flat h-12" 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#737373] uppercase mb-2 block">Email Address</label>
                  <input 
                    className="input-flat h-12 bg-slate-50 cursor-not-allowed" 
                    value={profile.email} 
                    disabled
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#737373] uppercase mb-2 block">Phone Number</label>
                  <input 
                    className="input-flat h-12" 
                    value={profile.phone} 
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-[#737373] uppercase mb-2 block">Location / Address</label>
                  <input 
                    className="input-flat h-12" 
                    placeholder="City, Country"
                    value={profile.address} 
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Integrations */}
            <div className="bg-white border border-[#e5e0d8] rounded-2xl p-8 shadow-sm">
              <h3 className="text-[10px] font-bold text-[#8b5e34] uppercase tracking-widest mb-6 border-b border-[#f5f2ed] pb-4">02 — Professional Links</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-[#737373] uppercase mb-2 block">LinkedIn Profile URL</label>
                  <input 
                    className="input-flat h-12" 
                    placeholder="https://linkedin.com/in/username"
                    value={profile.linkedinUrl} 
                    onChange={(e) => setProfile({...profile, linkedinUrl: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#737373] uppercase mb-2 block">GitHub Portfolio URL</label>
                  <input 
                    className="input-flat h-12" 
                    placeholder="https://github.com/username"
                    value={profile.githubUrl} 
                    onChange={(e) => setProfile({...profile, githubUrl: e.target.value})}
                  />
                  <p className="text-[10px] text-[#a3a3a3] mt-2 italic">Essential for AI-driven project selection and scoring.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="btn-primary px-12 py-4 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#8b5e34]/20"
              >
                {isSaving ? 'Synchronizing...' : 'Save All Changes'}
              </button>
            </div>
          </form>
        </div>
    </div>
  );
}
