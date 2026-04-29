'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    linkedinUrl: '',
    githubUrl: ''
  });

  useEffect(() => {
    // Check if already onboarded
    const checkStatus = async () => {
      try {
        const { data } = await api.get('/user/profile');
        if (data.name && data.email) {
          router.push('/dashboard');
        }
      } catch (err) {}
    };
    checkStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/user/profile', formData);
      toast.success('Onboarding complete!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to save profile');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2ed] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-12 border border-[#e5e0d8]">
        <div className="mb-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#8b5e34] flex items-center justify-center font-bold text-white shadow-md mx-auto mb-4">
            R
          </div>
          <h1 className="text-3xl font-bold text-[#2d2d2d] font-heading">Onboarding</h1>
          <p className="text-[#737373] text-sm mt-2">Initialize your professional profile to begin creation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest mb-2 block">Full Name</label>
              <input 
                required
                className="input-flat h-14" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest mb-2 block">Email</label>
              <input 
                required
                type="email"
                className="input-flat h-12" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest mb-2 block">Phone</label>
              <input 
                required
                className="input-flat h-12" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest mb-2 block">Address</label>
              <input 
                className="input-flat h-12" 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest mb-2 block">LinkedIn URL</label>
              <input 
                className="input-flat h-12" 
                value={formData.linkedinUrl} 
                onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest mb-2 block">GitHub URL</label>
              <input 
                className="input-flat h-12" 
                value={formData.githubUrl} 
                onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-4 text-xs font-black uppercase tracking-widest shadow-lg shadow-[#8b5e34]/20">
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
}
