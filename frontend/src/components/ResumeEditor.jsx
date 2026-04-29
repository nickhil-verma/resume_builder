'use client';
import React from 'react';

const SectionHeader = ({ number, title, onAdd, addLabel }) => (
  <div className="flex justify-between items-center mb-8 border-b border-[#f5f2ed] pb-4">
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-black text-[#8b5e34] bg-[#8b5e34]/10 w-6 h-6 rounded flex items-center justify-center">{number}</span>
      <h3 className="text-[11px] font-black text-[#2d2d2d] uppercase tracking-[0.2em]">{title}</h3>
    </div>
    {onAdd && (
      <button 
        onClick={onAdd}
        className="text-[9px] font-black text-blue-600 uppercase hover:underline tracking-widest"
      >
        + {addLabel}
      </button>
    )}
  </div>
);

export default function ResumeEditor({ data, onChange }) {
  const handlePersonalInfo = (e) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [name]: value }
    });
  };

  const handleArrayChange = (field, index, key, value) => {
    const newArr = [...data[field]];
    newArr[index] = { ...newArr[index], [key]: value };
    onChange({ ...data, [field]: newArr });
  };

  const addArrayItem = (field, template) => {
    onChange({ ...data, [field]: [...data[field], template] });
  };

  const removeArrayItem = (field, index) => {
    const newArr = data[field].filter((_, i) => i !== index);
    onChange({ ...data, [field]: newArr });
  };

  return (
    <div className="space-y-12 pb-32">
      {/* 01 Identity */}
      <section>
        <SectionHeader number="01" title="Core Identity" />
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="text-[9px] font-black text-[#a3a3a3] uppercase tracking-widest mb-2 block">Full Name</label>
            <input 
              name="name"
              className="input-flat h-14 text-base font-medium" 
              value={data.personalInfo?.name || ''} 
              onChange={handlePersonalInfo}
              placeholder="e.g. Alexander Hamilton"
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-[#a3a3a3] uppercase tracking-widest mb-2 block">Email Address</label>
            <input 
              name="email"
              className="input-flat h-12" 
              value={data.personalInfo?.email || ''} 
              onChange={handlePersonalInfo}
              placeholder="alex@hamilton.com"
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-[#a3a3a3] uppercase tracking-widest mb-2 block">Phone Number</label>
            <input 
              name="phone"
              className="input-flat h-12" 
              value={data.personalInfo?.phone || ''} 
              onChange={handlePersonalInfo}
              placeholder="+1 555 0101"
            />
          </div>
        </div>
      </section>

      {/* 02 Profile */}
      <section>
        <SectionHeader number="02" title="Professional Narrative" />
        <div>
          <label className="text-[9px] font-black text-[#a3a3a3] uppercase tracking-widest mb-2 block">Executive Summary</label>
          <textarea 
            className="input-flat min-h-[140px] text-sm leading-relaxed p-5"
            value={data.summary || ''}
            onChange={(e) => onChange({ ...data, summary: e.target.value })}
            placeholder="A compelling overview of your career trajectory..."
          />
        </div>
      </section>

      {/* 03 Experience */}
      <section>
        <SectionHeader 
          number="03" 
          title="Career History" 
          onAdd={() => addArrayItem('experience', { company: '', role: '', desc: '' })} 
          addLabel="Add Position"
        />
        <div className="space-y-6">
          {data.experience?.map((exp, i) => (
            <div key={i} className="p-6 bg-[#fdfbf9] border border-[#e5e0d8] rounded-2xl relative group hover:border-[#8b5e34]/30 transition-all">
              <button 
                onClick={() => removeArrayItem('experience', i)}
                className="absolute top-4 right-4 text-[9px] font-black text-red-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter"
              >
                Delete
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-black text-[#a3a3a3] uppercase tracking-widest mb-1 block">Company</label>
                  <input 
                    className="input-flat text-xs font-bold"
                    value={exp.company}
                    onChange={(e) => handleArrayChange('experience', i, 'company', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[8px] font-black text-[#a3a3a3] uppercase tracking-widest mb-1 block">Role</label>
                  <input 
                    className="input-flat text-xs font-bold"
                    value={exp.role}
                    onChange={(e) => handleArrayChange('experience', i, 'role', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[8px] font-black text-[#a3a3a3] uppercase tracking-widest block">Key Achievements</label>
                    <button 
                      onClick={async () => {
                        const { data: tailored } = await api.post('/ai/generate', { 
                          prompt: `Tailor this job experience bullet for a ${data.jobTitle} role. Original: ${exp.desc}` 
                        });
                        handleArrayChange('experience', i, 'desc', tailored);
                      }}
                      className="text-[8px] font-black text-[#8b5e34] uppercase tracking-tighter hover:underline"
                    >
                      ✨ Tailor with AI
                    </button>
                  </div>
                  <textarea 
                    className="input-flat text-xs min-h-[100px] leading-relaxed"
                    value={exp.desc}
                    onChange={(e) => handleArrayChange('experience', i, 'desc', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 04 Education */}
      <section>
        <SectionHeader 
          number="04" 
          title="Academic History" 
          onAdd={() => addArrayItem('education', { school: '', degree: '' })} 
          addLabel="Add Institution"
        />
        <div className="space-y-6">
          {data.education?.map((edu, i) => (
            <div key={i} className="p-6 bg-[#fdfbf9] border border-[#e5e0d8] rounded-2xl relative group hover:border-[#8b5e34]/30 transition-all">
              <button 
                onClick={() => removeArrayItem('education', i)}
                className="absolute top-4 right-4 text-[9px] font-black text-red-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase"
              >
                Delete
              </button>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Institution Name"
                  className="input-flat text-xs font-bold"
                  value={edu.school}
                  onChange={(e) => handleArrayChange('education', i, 'school', e.target.value)}
                />
                <input 
                  placeholder="Degree / Certificate"
                  className="input-flat text-xs font-bold"
                  value={edu.degree}
                  onChange={(e) => handleArrayChange('education', i, 'degree', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 05 Projects */}
      <section>
        <SectionHeader 
          number="05" 
          title="Portfolio Highlights" 
          onAdd={() => addArrayItem('projects', { name: '', desc: '', url: '' })} 
          addLabel="Add Project"
        />
        <div className="space-y-6">
          {data.projects?.map((proj, i) => (
            <div key={i} className="p-6 bg-[#fdfbf9] border border-[#e5e0d8] rounded-2xl relative group hover:border-[#8b5e34]/30 transition-all">
              <button 
                onClick={() => removeArrayItem('projects', i)}
                className="absolute top-4 right-4 text-[9px] font-black text-red-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase"
              >
                Delete
              </button>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Project Title"
                  className="input-flat text-xs font-bold"
                  value={proj.name}
                  onChange={(e) => handleArrayChange('projects', i, 'name', e.target.value)}
                />
                <input 
                  placeholder="Reference URL"
                  className="input-flat text-xs font-bold"
                  value={proj.url}
                  onChange={(e) => handleArrayChange('projects', i, 'url', e.target.value)}
                />
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[8px] font-black text-[#a3a3a3] uppercase tracking-widest block">Impact & Technical Details</label>
                    <button 
                      onClick={async () => {
                        const { data: tailored } = await api.post('/ai/generate', { 
                          prompt: `Tailor this project description for a ${data.jobTitle} role. Original: ${proj.desc}` 
                        });
                        handleArrayChange('projects', i, 'desc', tailored);
                      }}
                      className="text-[8px] font-black text-[#8b5e34] uppercase tracking-tighter hover:underline"
                    >
                      ✨ Tailor with AI
                    </button>
                  </div>
                  <textarea 
                    placeholder="Impact & Technical Details"
                    className="input-flat text-xs min-h-[80px]"
                    value={proj.desc}
                    onChange={(e) => handleArrayChange('projects', i, 'desc', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 06 Achievements */}
      <section>
        <SectionHeader 
          number="06" 
          title="Milestones & Results" 
          onAdd={() => addArrayItem('achievements', { text: '', link: '' })} 
          addLabel="Add Achievement"
        />
        <div className="space-y-6">
          {data.achievements?.map((ach, i) => (
            <div key={i} className="p-6 bg-[#fdfbf9] border border-[#e5e0d8] rounded-2xl relative group hover:border-[#8b5e34]/30 transition-all">
              <button onClick={() => removeArrayItem('achievements', i)} className="absolute top-4 right-4 text-[9px] font-black text-red-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase">Delete</button>
              <div className="grid grid-cols-1 gap-4">
                <input 
                  placeholder="Achievement Description"
                  className="input-flat text-xs font-bold"
                  value={ach.text}
                  onChange={(e) => handleArrayChange('achievements', i, 'text', e.target.value)}
                />
                <input 
                  placeholder="Verification Link (optional)"
                  className="input-flat text-xs font-bold"
                  value={ach.link}
                  onChange={(e) => handleArrayChange('achievements', i, 'link', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 07 Certifications */}
      <section>
        <SectionHeader 
          number="07" 
          title="Certifications" 
          onAdd={() => addArrayItem('certifications', { name: '', issuer: '', link: '' })} 
          addLabel="Add Certificate"
        />
        <div className="space-y-6">
          {data.certifications?.map((cert, i) => (
            <div key={i} className="p-6 bg-[#fdfbf9] border border-[#e5e0d8] rounded-2xl relative group hover:border-[#8b5e34]/30 transition-all">
              <button onClick={() => removeArrayItem('certifications', i)} className="absolute top-4 right-4 text-[9px] font-black text-red-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase">Delete</button>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Certificate Name"
                  className="input-flat text-xs font-bold"
                  value={cert.name}
                  onChange={(e) => handleArrayChange('certifications', i, 'name', e.target.value)}
                />
                <input 
                  placeholder="Issuer"
                  className="input-flat text-xs font-bold"
                  value={cert.issuer}
                  onChange={(e) => handleArrayChange('certifications', i, 'issuer', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 08 Skills */}
      <section>
        <SectionHeader number="08" title="Core Expertise" />
        <div>
          <label className="text-[9px] font-black text-[#a3a3a3] uppercase tracking-widest mb-2 block">Technical & Soft Skills</label>
          <input 
            className="input-flat h-12"
            placeholder="Separated by commas (e.g. Python, Leadership, Cloud Architecture)"
            value={data.skills?.join(', ') || ''}
            onChange={(e) => onChange({ ...data, skills: e.target.value.split(',').map(s => s.trim()) })}
          />
        </div>
      </section>

      {/* 09 Structured Sections (Embeddings) */}
      <section>
        <SectionHeader 
          number="09" 
          title="Semantic Content (Embeddings)" 
          onAdd={() => addArrayItem('sections', { heading: '', subheading: '', content: '', embedding: [] })} 
          addLabel="Add Section Block"
        />
        <div className="space-y-6">
          {data.sections?.map((section, i) => (
            <div key={i} className="p-8 bg-[#fdfbf9] border border-[#e5e0d8] rounded-2xl relative group hover:border-[#8b5e34]/30 transition-all">
              <button 
                onClick={() => removeArrayItem('sections', i)}
                className="absolute top-4 right-4 text-[9px] font-black text-red-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter"
              >
                Delete
              </button>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[8px] font-black text-[#a3a3a3] uppercase tracking-widest mb-1 block">Heading</label>
                  <input 
                    className="input-flat text-xs font-bold"
                    placeholder="e.g. Technical Skills"
                    value={section.heading}
                    onChange={(e) => handleArrayChange('sections', i, 'heading', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[8px] font-black text-[#a3a3a3] uppercase tracking-widest mb-1 block">Subheading</label>
                  <input 
                    className="input-flat text-xs font-bold"
                    placeholder="e.g. Backend Development"
                    value={section.subheading}
                    onChange={(e) => handleArrayChange('sections', i, 'subheading', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[8px] font-black text-[#a3a3a3] uppercase tracking-widest mb-1 block">Raw Content (for matching)</label>
                  <textarea 
                    className="input-flat text-xs min-h-[80px] leading-relaxed"
                    placeholder="Enter full content text..."
                    value={section.content}
                    onChange={(e) => handleArrayChange('sections', i, 'content', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[8px] font-black text-[#a3a3a3] uppercase tracking-widest mb-1 block">Embeddings (Vector)</label>
                  <input 
                    className="input-flat text-[10px] font-mono text-[#737373] bg-[#f5f2ed]"
                    placeholder="[0.12, 0.45, ...]"
                    value={JSON.stringify(section.embedding || [])}
                    onChange={(e) => {
                      try {
                        const val = JSON.parse(e.target.value);
                        if (Array.isArray(val)) handleArrayChange('sections', i, 'embedding', val);
                      } catch (err) {}
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
