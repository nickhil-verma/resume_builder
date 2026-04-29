'use client';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/signup', formData);
      toast.success('Account created! Please login.');
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f2ed] px-6">
      <div className="w-full max-w-md bg-[#ffffff] border border-[#e5e0d8] p-10 rounded-2xl shadow-xl">
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-xl bg-[#8b5e34] flex items-center justify-center font-bold text-white text-2xl mx-auto mb-8 shadow-md">
            R
          </div>
          <h2 className="text-3xl font-bold text-[#2d2d2d] font-heading tracking-tight">Onboarding</h2>
          <p className="text-[#a3a3a3] text-sm mt-3 font-semibold uppercase tracking-widest">Create New Account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em] block mb-2.5">Full Name</label>
            <input
              type="text"
              required
              className="input-flat"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em] block mb-2.5">Email Address</label>
            <input
              type="email"
              required
              className="input-flat"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em] block mb-2.5">Security Password</label>
            <input
              type="password"
              required
              className="input-flat"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-4 mt-6 uppercase tracking-[0.2em] text-xs font-black shadow-lg shadow-[#8b5e34]/10"
          >
            {isLoading ? 'Creating...' : 'Initialize Account'}
          </button>
        </form>

        <div className="text-center mt-12 pt-10 border-t border-[#f5f2ed]">
          <p className="text-[#a3a3a3] text-[10px] font-bold uppercase tracking-widest">
            Already have an account?{' '}
            <Link href="/login" className="text-[#8b5e34] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
