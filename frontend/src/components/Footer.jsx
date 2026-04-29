import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#e5e0d8] bg-[#fdfbf9]">
      <div className="max-w-7xl mx-auto px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#8b5e34]/10 flex items-center justify-center font-bold text-[#8b5e34] text-[11px] shadow-sm">
            R
          </div>
          <span className="font-bold text-[#2d2d2d] font-heading tracking-tight text-lg">ResumeX</span>
        </div>

        <p className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-[0.3em]">
          © 2026 ResumeX — Minimalist Excellence.
        </p>

        <div className="flex gap-10 text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em]">
          <Link href="#" className="hover:text-[#8b5e34] transition-colors">
            GitHub
          </Link>
          <Link href="#" className="hover:text-[#8b5e34] transition-colors">
            Twitter
          </Link>
          <Link href="#" className="hover:text-[#8b5e34] transition-colors">
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}