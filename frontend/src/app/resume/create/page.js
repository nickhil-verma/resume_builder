'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function CreateResumeStep1() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobTitle || !jobDescription) {
      return toast.error('Please fill in all fields');
    }
    
    // Store locally for the next step
    localStorage.setItem('temp_resume_data', JSON.stringify({ jobTitle, jobDescription }));
    router.push('/resume/projects');
  };

  return (
    <div className="min-h-screen bg-[#f5f2ed] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 border border-[#e5e0d8]">
        <header className="mb-12 text-center">
          <div className="text-[10px] font-black text-[#8b5e34] uppercase tracking-[0.4em] mb-4">Step 01 — Configuration</div>
          <h1 className="text-4xl font-bold text-[#2d2d2d] font-heading tracking-tight">Define Target Role</h1>
          <p className="text-[#737373] mt-3 font-medium">Our AI will analyze your GitHub assets against these requirements</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest mb-3 block">Target Job Title</label>
            <input 
              required
              className="input-flat h-14 text-base" 
              placeholder="e.g. Senior Full Stack Engineer"
              value={jobTitle} 
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest mb-3 block">Job Description</label>
            <textarea 
              required
              className="input-flat min-h-[250px] p-6 text-sm leading-relaxed" 
              placeholder="Paste the full job description here..."
              value={jobDescription} 
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <button type="button" onClick={() => router.back()} className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest hover:text-[#2d2d2d]">Cancel</button>
            <button type="submit" className="btn-primary px-12 py-4 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#8b5e34]/20">
              Continue to Projects →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
