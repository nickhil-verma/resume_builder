'use client';

export default function FlatCard({ children, className = '' }) {
  return (
    <div className={`flat-card p-6 ${className}`}>
      {children}
    </div>
  );
}
