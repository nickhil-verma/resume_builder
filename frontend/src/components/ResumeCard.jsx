'use client';

export default function ResumeCard({ resume, onDelete }) {
  return (
    <div className="bg-[#ffffff] border border-[#e5e0d8] p-7 rounded-xl hover:border-[#8b5e34]/40 transition-all duration-300 group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between mb-5">
        <div className="text-[10px] font-bold px-2.5 py-1 bg-[#f5f2ed] text-[#8b5e34] rounded uppercase tracking-widest">
          Resume
        </div>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(resume.id); }}
          className="text-[10px] text-[#a3a3a3] hover:text-red-500 transition-colors uppercase font-bold tracking-widest"
        >
          Remove
        </button>
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-[#2d2d2d] font-heading group-hover:text-[#8b5e34] transition-colors line-clamp-1">
        {resume.title}
      </h3>
      
      <p className="text-sm text-[#737373] mb-8 line-clamp-2 leading-relaxed">
        {resume.summary || "No summary provided for this resume. Start drafting your career story."}
      </p>
      
      <div className="flex items-center justify-between text-[10px] text-[#a3a3a3] uppercase tracking-widest font-bold pt-4 border-t border-[#f5f2ed]">
        <span>Last Updated</span>
        <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
