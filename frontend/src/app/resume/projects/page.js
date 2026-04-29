'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function SelectProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tempData, setTempData] = useState(null);

  const [manualProjects, setManualProjects] = useState([{ name: '', description: '' }]);

  useEffect(() => {
    const data = localStorage.getItem('temp_resume_data');
    if (!data) {
      router.push('/resume/create');
      return;
    }
    setTempData(JSON.parse(data));
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects/github');
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (error) {
      // Just fail silently and let them use manual
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProject = (name) => {
    setSelectedIds(prev => 
      prev.includes(name) ? prev.filter(id => id !== name) : [...prev, name]
    );
  };

  const updateManualProject = (index, field, value) => {
    const newProjects = [...manualProjects];
    newProjects[index][field] = value;
    setManualProjects(newProjects);
  };

  const addManualProject = () => {
    setManualProjects([...manualProjects, { name: '', description: '' }]);
  };

  const handleContinue = async () => {
    const validManual = manualProjects.filter(p => p.name.trim() !== '');

    if (selectedIds.length === 0 && validManual.length === 0) {
      // If nothing selected or typed, we'll allow skipping. 
      // But let's prompt them just in case. Wait, user wants to enter manually, so we don't strictly block.
    }

    setIsLoading(true);
    try {
      const selected = projects.filter(p => selectedIds.includes(p.name));
      
      const githubText = selected
          .map(p => `${p.name} — ${p.description || p.suggestion || 'Core project development'}`)
          .join('\n\n');
          
      const manualText = validManual
          .map(p => `${p.name} — ${p.description || ''}`)
          .join('\n\n');

      const projectsText = [githubText, manualText].filter(Boolean).join('\n\n');

      const compilerData = {
        jobTitle: tempData?.jobTitle || "",
        jobDescription: tempData?.jobDescription || "",
        projects: projectsText
      };

      // Pass directly to compiler
      localStorage.setItem('compiled_resume', JSON.stringify(compilerData));
      localStorage.removeItem('temp_resume_data');
      
      toast.success('Assets Synthesized Successfully');
      router.push('/resumecompiler');
    } catch (error) {
      toast.error('Initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2ed] p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16 text-center">
          <div className="text-[10px] font-black text-[#8b5e34] uppercase tracking-[0.4em] mb-4">Step 02 — Asset Selection</div>
          <h1 className="text-5xl font-bold text-[#2d2d2d] font-heading tracking-tighter">Choose GitHub Projects</h1>
          <p className="text-[#737373] mt-3 font-medium">Select repositories or enter them manually to demonstrate your expertise</p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-white rounded-2xl border border-[#e5e0d8] animate-pulse" />)}
          </div>
        ) : projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {projects.map(project => (
              <div 
                key={project.name}
                onClick={() => toggleProject(project.name)}
                className={`p-8 bg-white rounded-2xl border-2 transition-all cursor-pointer group relative ${
                  selectedIds.includes(project.name) ? 'border-[#8b5e34] ring-4 ring-[#8b5e34]/5' : 'border-[#e5e0d8] hover:border-[#8b5e34]/30'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[#2d2d2d] font-heading">{project.name}</h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedIds.includes(project.name) ? 'bg-[#8b5e34] border-[#8b5e34]' : 'border-[#e5e0d8] group-hover:border-[#8b5e34]/50'
                  }`}>
                    {selectedIds.includes(project.name) && <span className="text-white text-xs">✓</span>}
                  </div>
                </div>
                <p className="text-[#737373] text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
                  {project.description || 'No description provided for this repository.'}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-[#a3a3a3] uppercase tracking-widest px-2 py-1 bg-[#fdfbf9] rounded border border-[#e5e0d8]">
                    {project.language || 'Code'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white border border-[#e5e0d8] rounded-2xl p-8 mb-12 shadow-sm">
            <h2 className="text-lg font-bold text-[#2d2d2d] font-heading mb-6">Manual Project Entry</h2>
            {manualProjects.map((proj, i) => (
                <div key={i} className="flex gap-4 mb-4">
                    <input 
                        className="input-flat w-1/3" 
                        placeholder="Project Name" 
                        value={proj.name}
                        onChange={(e) => updateManualProject(i, 'name', e.target.value)}
                    />
                    <input 
                        className="input-flat flex-1" 
                        placeholder="Brief Description or Key Technologies" 
                        value={proj.description}
                        onChange={(e) => updateManualProject(i, 'description', e.target.value)}
                    />
                </div>
            ))}
            <button 
                onClick={addManualProject}
                className="text-[10px] font-black text-[#8b5e34] uppercase tracking-widest hover:underline mt-2"
            >
                + Add Another Manual Project
            </button>
        </div>

        <div className="flex justify-between items-center pt-10 border-t border-[#e5e0d8]">
          <button onClick={() => router.back()} className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest hover:text-[#2d2d2d]">← Back to Config</button>
          <div className="flex items-center gap-8">
            <span className="text-[10px] font-black text-[#8b5e34] uppercase tracking-widest">{selectedIds.length + manualProjects.filter(p => p.name).length} Selected</span>
            <button 
              onClick={handleContinue}
              className="btn-primary px-16 py-5 text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-[#8b5e34]/20"
            >
              Initialize Workspace →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
