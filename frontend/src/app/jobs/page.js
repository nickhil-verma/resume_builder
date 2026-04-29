'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function JobTracker() {
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    resumeId: '',
    atsScore: 0,
    matchPercentage: 0,
    notes: ''
  });

  useEffect(() => {
    fetchApplications();
    fetchResumes();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/jobs');
      setApplications(data);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const { data } = await api.get('/resume');
      setResumes(data);
    } catch (err) {}
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', formData);
      toast.success('Application added');
      setShowModal(false);
      fetchApplications();
      setFormData({ companyName: '', jobTitle: '', jobDescription: '', resumeId: '', atsScore: 0, matchPercentage: 0, notes: '' });
    } catch (error) {
      toast.error('Failed to add application');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this application?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setApplications(applications.filter(a => a.id !== id));
      toast.success('Application removed');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  return (
    <div className="w-full h-full p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <div className="text-[10px] font-bold text-[#8b5e34] uppercase tracking-[0.3em] mb-3">Intelligence</div>
            <h1 className="text-4xl font-bold text-[#2d2d2d] font-heading tracking-tight">Job Tracker</h1>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest"
          >
            + Add Application
          </button>
        </header>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-xl border border-[#e5e0d8]" />)}
          </div>
        ) : applications.length > 0 ? (
          <div className="bg-white border border-[#e5e0d8] rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#fdfbf9] border-b border-[#f5f2ed]">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#a3a3a3]">Company</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#a3a3a3]">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#a3a3a3]">Resume Used</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#a3a3a3]">ATS Score</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#a3a3a3]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f2ed]">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 font-bold text-sm text-[#2d2d2d]">{app.companyName}</td>
                    <td className="px-6 py-5 text-sm text-[#737373]">{app.jobTitle}</td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded uppercase">{app.resume?.title}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#8b5e34]" style={{ width: `${app.atsScore}%` }} />
                        </div>
                        <span className="text-[10px] font-black text-[#8b5e34]">{app.atsScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <button onClick={() => handleDelete(app.id)} className="text-red-400 hover:text-red-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white border border-[#e5e0d8] rounded-2xl p-20 text-center">
            <p className="text-[#a3a3a3] text-sm uppercase font-bold tracking-widest">No applications tracked yet.</p>
          </div>
        )}

        {/* Add Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 font-heading">Track New Application</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Company Name" className="input-flat" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} required />
                  <input placeholder="Job Title" className="input-flat" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} required />
                </div>
                <select 
                  className="input-flat" 
                  value={formData.resumeId} 
                  onChange={e => setFormData({...formData, resumeId: e.target.value})}
                  required
                >
                  <option value="">Select Resume Used</option>
                  {resumes.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase mb-1 block">ATS Score (%)</label>
                    <input type="number" className="input-flat" value={formData.atsScore} onChange={e => setFormData({...formData, atsScore: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase mb-1 block">Match %</label>
                    <input type="number" className="input-flat" value={formData.matchPercentage} onChange={e => setFormData({...formData, matchPercentage: e.target.value})} />
                  </div>
                </div>
                <textarea placeholder="Job Description (for reference)" className="input-flat min-h-[100px]" value={formData.jobDescription} onChange={e => setFormData({...formData, jobDescription: e.target.value})} />
                <textarea placeholder="Personal Notes" className="input-flat min-h-[80px]" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">Cancel</button>
                  <button type="submit" className="btn-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest">Save Application</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
}
