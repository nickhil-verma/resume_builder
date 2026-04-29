'use client';
import React from 'react';

const templates = [
  { id: 'modern', name: 'Modern' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'professional', name: 'Professional' },
  { id: 'creative', name: 'Creative' },
  { id: 'compact', name: 'Compact' },
];

export default function TemplateSelector({ selected, onSelect }) {
  return (
    <div className="flex gap-2">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
            selected === t.id 
              ? 'bg-[#8b5e34] text-white shadow-md' 
              : 'bg-white border border-[#e5e0d8] text-[#737373] hover:border-[#8b5e34]/30'
          }`}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}
