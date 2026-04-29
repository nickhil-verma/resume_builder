'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { debounce } from 'lodash';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import ResumeEditor from '@/components/ResumeEditor';
import ResumePreview from '@/components/ResumePreview';
import TemplateSelector from '@/components/TemplateSelector';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { downloadResumeFile } from '@/utils/download';

export default function EditorPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [saveStatus, setSaveStatus] = useState('Saved'); 
  const resumeRef = useRef();

  useEffect(() => {
    if (!id || id === 'undefined') return;
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/resume/${id}`);
        setData(data);
      } catch (error) {
        toast.error('Failed to load resume');
      }
    };
    fetchData();
  }, [id]);

  const saveToBackend = async (currentData) => {
    setSaveStatus('Saving...');
    try {
      await api.put(`/resume/${id}`, currentData);
      setSaveStatus('Saved');
    } catch (error) {
      setSaveStatus('Error');
      toast.error('Failed to save changes');
    }
  };

  const debouncedSave = useCallback(
    debounce((nextData) => saveToBackend(nextData), 2000),
    [id]
  );

  const handleDataChange = (newData) => {
    setData(newData);
    setSaveStatus('Changes Unsaved');
    if (isAutoSave) {
      debouncedSave(newData);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: data?.title || 'resume',
  });

  if (!data) return (
    <div className="h-screen flex items-center justify-center bg-[#f5f2ed]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#8b5e34] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-bold text-[#8b5e34] uppercase tracking-widest">Waking up Gemini...</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#f5f2ed] overflow-hidden">
      {/* Sticky Toolbar */}
      <header className="h-20 border-b border-[#e5e0d8] bg-white px-8 flex items-center justify-between shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="w-10 h-10 rounded-full border border-[#e5e0d8] flex items-center justify-center text-[#737373] hover:border-[#8b5e34] hover:text-[#8b5e34] transition-all">
             ←
          </Link>
          <div>
            <h1 className="font-bold text-[#2d2d2d] text-base leading-tight">{data.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-tighter ${
                saveStatus === 'Saved' ? 'text-green-600 bg-green-50' : 'text-orange-500 bg-orange-50'
              }`}>
                {saveStatus}
              </span>
              <div className="h-3 w-[1px] bg-[#e5e0d8]" />
              <button 
                onClick={() => setIsAutoSave(!isAutoSave)}
                className="flex items-center gap-2 group"
              >
                <div className={`w-6 h-3.5 rounded-full relative transition-colors ${isAutoSave ? 'bg-green-500' : 'bg-[#e5e0d8]'}`}>
                  <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${isAutoSave ? 'left-3' : 'left-0.5'}`} />
                </div>
                <span className="text-[9px] font-bold text-[#a3a3a3] uppercase group-hover:text-[#8b5e34]">Auto</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TemplateSelector 
            selected={data.template} 
            onSelect={(t) => handleDataChange({ ...data, template: t })} 
          />
          <div className="h-8 w-[1px] bg-[#e5e0d8] mx-2" />
          <button 
            onClick={handlePrint} 
            className="px-6 py-3 rounded-xl border-2 border-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
          >
            Print
          </button>
          <button 
            onClick={() => downloadResumeFile(id, 'docx')} 
            className="px-6 py-3 rounded-xl border border-[#e5e0d8] font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Word
          </button>
          <button 
            onClick={() => downloadResumeFile(id, 'pdf')} 
            className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-black/10"
          >
            Premium AI PDF
          </button>
        </div>
      </header>

      {/* Resizable Panels */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={45} minSize={30}>
            <div className="h-full overflow-y-auto bg-white p-10 scrollbar-thin scrollbar-thumb-[#e5e0d8]">
              <div className="max-w-2xl mx-auto">
                <ResumeEditor data={data} onChange={handleDataChange} />
              </div>
            </div>
          </Panel>
          
          <PanelResizeHandle className="w-1.5 bg-[#f5f2ed] hover:bg-[#8b5e34]/20 transition-colors border-x border-[#e5e0d8] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#e5e0d8] rounded-full" />
          </PanelResizeHandle>

          <Panel minSize={30}>
            <div className="h-full overflow-y-auto bg-slate-100 scrollbar-thin scrollbar-thumb-white">
              <ResumePreview ref={resumeRef} data={data} template={data.template} />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
