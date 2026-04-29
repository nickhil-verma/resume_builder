'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function InitializeEditor() {
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      const data = localStorage.getItem('temp_resume_data');
      if (!data) {
        router.push('/resume/create');
        return;
      }

      const { jobTitle, jobDescription, selectedProjects } = JSON.parse(data);

      try {
        // Prepare projects as a string block for the compiler
        const projectsText = selectedProjects
            .map(p => `${p.name} — ${p.description || p.suggestion || 'Core project development'}`)
            .join('\n\n');

        const compilerData = {
          jobTitle: jobTitle || "",
          jobDescription: jobDescription || "",
          projects: projectsText
        };

        // Pass to ResumeCompiler via localStorage
        localStorage.setItem('compiled_resume', JSON.stringify(compilerData));
        
        // Clear temp data
        localStorage.removeItem('temp_resume_data');
        
        toast.success('Assets Synthesized Successfully');
        router.push('/resumecompiler');
      } catch (error) {
        console.error('INIT ERROR:', error);
        toast.error('Failed to initialize workspace');
        router.push('/dashboard');
      }
    };

    init();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-[#f5f2ed]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#8b5e34] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-[#2d2d2d] font-heading tracking-tight">Architecting Your Environment</h2>
        <p className="text-[#a3a3a3] text-sm mt-2 uppercase tracking-[0.3em] font-black">Synthesizing Assets...</p>
      </div>
    </div>
  );
}
