'use client';
import React from 'react';

// Common Print Styles
const printStyles = `
  @media print {
    @page { margin: 0; size: A4; }
    body { background: white; }
    .no-print { display: none !important; }
    .resume-page { margin: 0 !important; box-shadow: none !important; }
  }
`;

// --- TEMPLATES ---

const ModernTemplate = ({ data }) => (
  <div className="resume-content flex flex-col h-full text-[#1a1a1a]">
    <header className="bg-slate-900 text-white p-10">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-2 font-heading">{data.personalInfo?.name || 'Full Name'}</h1>
      <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-xs">{data.jobTitle || 'Target Role'}</p>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <span>{data.personalInfo?.email}</span>
        <span>{data.personalInfo?.phone}</span>
        <span>{data.personalInfo?.address}</span>
      </div>
    </header>

    <div className="p-10 flex-1 space-y-10">
      <section>
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Summary</h2>
        <p className="text-sm leading-relaxed font-medium">{data.summary || data.tailoredSummary}</p>
      </section>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-10">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-5">Experience</h2>
            <div className="space-y-8">
              {data.experience?.map((exp, i) => (
                <div key={i}>
                  <h3 className="font-bold text-base text-slate-900">{exp.role}</h3>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest mt-1">{exp.company}</p>
                  <p className="text-sm mt-3 text-slate-600 leading-relaxed">{exp.desc}</p>
                </div>
              ))}
              {(!data.experience || data.experience.length === 0) && (
                <p className="text-xs text-slate-400 italic">No experience added yet.</p>
              )}
            </div>
          </section>
          
          {(data.achievements?.length > 0 || data.projects?.length > 0) && (
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-5">Highlights & Projects</h2>
              <div className="space-y-6">
                {data.projects?.map((proj, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-sm text-slate-900">{proj.name}</h3>
                      {proj.url && <a href={proj.url} className="text-[9px] text-blue-500 font-bold uppercase underline">Source</a>}
                    </div>
                    <p className="text-xs mt-2 text-slate-600 leading-relaxed">{proj.desc}</p>
                  </div>
                ))}
                {data.achievements?.map((ach, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-blue-500 font-bold">•</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-700 leading-relaxed">{ach.text}</p>
                      {ach.link && <a href={ach.link} className="text-[8px] text-blue-400 uppercase font-black tracking-tighter mt-1 block hover:underline">Verify Result</a>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
      </div>
      
      {/* Structured Sections */}
      {data.sections?.length > 0 && (
        <div className="space-y-10 mt-10">
          {data.sections.map((sec, i) => (
            <section key={i}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">{sec.heading}</h2>
              {sec.subheading && <h3 className="font-bold text-sm text-slate-900 mb-2">{sec.subheading}</h3>}
              <p className="text-sm leading-relaxed text-slate-600">{sec.content}</p>
            </section>
          ))}
        </div>
      )}
    </div>
  </div>
</div>
);

const MinimalTemplate = ({ data }) => (
  <div className="resume-content p-14 h-full flex flex-col font-serif">
    <header className="mb-14 text-center">
      <h1 className="text-4xl font-light italic mb-2 tracking-tight">{data.personalInfo?.name}</h1>
      <div className="text-xs text-slate-500 flex justify-center gap-4 italic">
        <span>{data.personalInfo?.email}</span>
        <span>•</span>
        <span>{data.personalInfo?.phone}</span>
      </div>
    </header>

    <div className="max-w-2xl mx-auto space-y-12">
      <section className="text-center italic opacity-80 text-sm leading-relaxed">
        {data.summary || data.tailoredSummary}
      </section>

      <section>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mb-6">Chronology</h2>
        <div className="space-y-8">
          {data.experience?.map((exp, i) => (
            <div key={i} className="relative pl-8 border-l border-slate-100">
              <div className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-slate-200" />
              <h3 className="font-bold text-slate-900">{exp.role}</h3>
              <p className="text-xs italic text-slate-500 mt-0.5">{exp.company}</p>
              <p className="text-sm mt-3 leading-relaxed opacity-90">{exp.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

const ProfessionalTemplate = ({ data }) => (
  <div className="resume-content flex flex-col h-full bg-white font-sans border-t-[12px] border-blue-900">
    <div className="p-12 pb-0 flex justify-between items-end mb-10">
      <div>
        <h1 className="text-5xl font-black text-slate-900 leading-none mb-2">{data.personalInfo?.name}</h1>
        <p className="text-blue-700 font-black uppercase tracking-[0.25em] text-xs">{data.jobTitle}</p>
      </div>
      <div className="text-right text-[10px] font-bold text-slate-500 leading-relaxed">
        <p>{data.personalInfo?.address}</p>
        <p>{data.personalInfo?.phone}</p>
        <p className="text-blue-700 underline">{data.personalInfo?.email}</p>
      </div>
    </div>

    <div className="px-12 pb-12 flex gap-12 flex-1">
      <div className="flex-1 space-y-12">
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-blue-900 border-b-2 border-slate-100 pb-2 mb-6">Profile</h2>
          <p className="text-sm leading-relaxed text-slate-700 font-medium">{data.summary || data.tailoredSummary}</p>
        </section>
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-blue-900 border-b-2 border-slate-100 pb-2 mb-6">Experience</h2>
          <div className="space-y-8">
            {data.experience?.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">{exp.company}</h3>
                  <span className="text-[10px] font-black uppercase text-slate-400">{exp.role}</span>
                </div>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{exp.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="w-48 space-y-12 shrink-0">
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-blue-900 border-b-2 border-slate-100 pb-2 mb-6">Skills</h2>
          <div className="space-y-3">
            {data.skills?.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                <span className="text-xs font-bold text-slate-700">{s}</span>
              </div>
            ))}
          </div>
        </section>

        {data.certifications?.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-blue-900 border-b-2 border-slate-100 pb-2 mb-6">Certs</h2>
            <div className="space-y-4">
              {data.certifications.map((c, i) => (
                <div key={i}>
                  <p className="text-[10px] font-black uppercase text-blue-900">{c.name}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{c.issuer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

// --- MAIN WRAPPER ---

const ResumePreview = React.forwardRef(({ data, template = 'modern' }, ref) => {
  const renderTemplate = () => {
    switch (template) {
      case 'minimal': return <MinimalTemplate data={data} />;
      case 'professional': return <ProfessionalTemplate data={data} />;
      default: return <ModernTemplate data={data} />;
    }
  };

  return (
    <>
      <style>{printStyles}</style>
      <div className="preview-container flex justify-center py-10 bg-[#e2e8f0] min-h-full">
        <div 
          ref={ref} 
          className="resume-page bg-white shadow-2xl relative overflow-hidden"
          style={{ 
            width: '210mm', 
            minHeight: '297mm',
            margin: '0 auto',
            transformOrigin: 'top center',
            scale: '0.85' // Scale down for better preview on smaller screens
          }}
        >
          {renderTemplate()}
        </div>
      </div>
    </>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
