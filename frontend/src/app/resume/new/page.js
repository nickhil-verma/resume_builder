'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function NewResume() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    jobTitle: '',
    jobDescription: '',
    selectedProjects: []
  });

  const [githubProjects, setGithubProjects] = useState([]);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const { data } = await api.get('/user/profile');
        if (!data.name || !data.email) {
          router.push('/onboarding');
          return;
        }
        setProfile(data);
      } catch (err) {}
    };
    fetchContext();
  }, []);

  const handleFetchAndAnalyze = async () => {
    if (!formData.jobDescription) return toast.error('Please enter a JD');
    if (!profile?.githubUrl) {
      toast.error('GitHub URL missing in profile. Please add it in settings first.');
      router.push('/settings');
      return;
    }
    
    setIsLoading(true);
    try {
      // 1. Fetch repos
      const { data: repos } = await api.get('/projects/github');
      
      if (!repos || repos.length === 0) {
        toast.error('No GitHub repositories found. Make sure your GitHub URL is correct and public.');
        return;
      }

      // 2. Analyze with AI
      const { data: analysis } = await api.post('/projects/analyze', {
        jd: formData.jobDescription,
        projects: repos
      });
      
      setGithubProjects(analysis.projects);
      setFormData(prev => ({
        ...prev,
        achievements: analysis.achievements || [],
        certifications: analysis.certifications || []
      }));
      setStep(2);
      toast.success('AI Analysis Complete!');
    } catch (error) {
      console.error('ANALYSIS ERROR:', error);
      toast.error('Failed to analyze projects. Please check your GitHub URL or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (formData.selectedProjects.length < 2 || formData.selectedProjects.length > 4) {
      return toast.error('Please select between 2 and 4 projects for a balanced resume.');
    }

    setIsLoading(true);
    try {
      const selected = githubProjects.filter(p => formData.selectedProjects.includes(p.name));
      
      const payload = {
        title: formData.title || `${formData.jobTitle} - ${new Date().toLocaleDateString()}`,
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        template: 'modern',
        personalInfo: {
          name: profile.name,
          email: profile.email,
          phone: profile.phone || '',
          address: profile.address || ''
        },
        skills: [...new Set(selected.flatMap(p => p.keywords))],
        projects: selected.map(p => ({
          name: p.name,
          desc: p.suggestion,
          url: p.url,
          highlights: p.keywords // Using keywords as highlights for now
        })),
        education: [], // Initialize empty
        experience: [], // Initialize empty
        summary: '', // Will be AI generated
        achievements: formData.achievements || [],
        certifications: formData.certifications || []
      };

      const { data } = await api.post('/resume', payload);
      toast.success('Resume Initialized Successfully!');
      router.push(`/resume/${data.id}`);
    } catch (error) {
      console.error('CREATE ERROR:', error);
      toast.error(error.response?.data?.message || 'Failed to initialize resume studio');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProject = (name) => {
    setFormData(prev => {
      const isSelected = prev.selectedProjects.includes(name);
      if (!isSelected && prev.selectedProjects.length >= 4) {
        toast.error('Maximum 4 projects allowed');
        return prev;
      }
      return {
        ...prev,
        selectedProjects: isSelected
          ? prev.selectedProjects.filter(n => n !== name)
          : [...prev.selectedProjects, name]
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f2ed] p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[#2d2d2d] font-heading tracking-tight">Generate Smart Asset</h1>
          <p className="text-[#737373] mt-2">Step {step} of 2 — {step === 1 ? 'Target Configuration' : 'Project Selection'}</p>
        </header>

        {step === 1 ? (
          <div className="bg-white rounded-2xl border border-[#e5e0d8] p-10 shadow-sm space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest mb-2 block">Resume Internal Name</label>
                <input 
                  className="input-flat h-14" 
                  placeholder="e.g. Google - Senior Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest mb-2 block">Target Role</label>
                <input 
                  className="input-flat h-14" 
                  placeholder="e.g. Senior Backend Engineer"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest mb-2 block">Job Description</label>
                <textarea 
                  className="input-flat min-h-[250px] p-6 text-sm leading-relaxed" 
                  placeholder="Paste the job description here..."
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleFetchAndAnalyze}
                disabled={isLoading}
                className="btn-primary px-12 py-4 text-[10px] font-black uppercase tracking-widest"
              >
                {isLoading ? 'Analyzing Assets...' : 'Continue to Projects →'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-[#737373]">Select 2-4 projects that best fit the role.</p>
                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  formData.selectedProjects.length >= 2 && formData.selectedProjects.length <= 4 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-orange-100 text-orange-600'
                }`}>
                  {formData.selectedProjects.length} / 4 Selected
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {githubProjects.map((project) => (
                 <div 
                  key={project.name}
                  onClick={() => toggleProject(project.name)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer bg-white relative ${
                    formData.selectedProjects.includes(project.name) ? 'border-[#8b5e34] ring-1 ring-[#8b5e34]' : 'border-[#e5e0d8] hover:border-[#8b5e34]/30'
                  }`}
                 >
                   <div className="flex justify-between items-start mb-4">
                     <h3 className="font-bold text-base text-[#2d2d2d]">{project.name}</h3>
                     <span className={`text-[10px] font-black px-2 py-1 rounded ${
                       project.relevance === 'High' ? 'bg-green-100 text-green-700' : 
                       project.relevance === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                     }`}>
                       {project.matchScore}% Match
                     </span>
                   </div>
                   <p className="text-xs text-[#737373] leading-relaxed mb-4">{project.suggestion}</p>
                   <div className="flex flex-wrap gap-2">
                     {project.keywords.map(k => (
                       <span key={k} className="text-[8px] font-bold uppercase tracking-tighter px-2 py-1 bg-slate-50 border border-slate-100 rounded text-slate-400">{k}</span>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
              <div className="flex justify-between items-center pt-10">
                <div className="flex items-center gap-4">
                  <button onClick={() => setStep(1)} className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest hover:text-[#2d2d2d]">← Back to JD</button>
                  <button onClick={handleFetchAndAnalyze} disabled={isLoading} className="text-[10px] font-bold text-[#8b5e34] uppercase tracking-widest hover:underline disabled:opacity-50">
                    ↻ Rescan Repos
                  </button>
                </div>
                <button 
                 onClick={handleCreate}
                 disabled={isLoading}
                 className="btn-primary px-16 py-4 text-[10px] font-black uppercase tracking-widest"
                >
                  {isLoading ? 'Generating Workspace...' : 'Initialize Resume Studio'}
                </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
