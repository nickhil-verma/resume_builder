'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import FlatCard from '@/components/GlassCard';
import Footer from '@/components/Footer';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Home() {
  return (
    <div className="bg-[#f5f2ed] selection:bg-[#8b5e34] selection:text-white">
      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 max-w-7xl mx-auto text-center relative overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.05 }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-[#8b5e34] rounded-full blur-[100px] pointer-events-none"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#8b5e34]/5 border border-[#8b5e34]/10 text-[#8b5e34] text-[10px] font-black uppercase tracking-[0.3em] mb-12 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#8b5e34] animate-pulse" />
          The Intelligence Era of Career Growth
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-7xl md:text-[110px] font-bold mb-10 text-[#2d2d2d] font-heading tracking-tighter leading-[0.95]"
        >
          Architect Your <br />
          <span className="text-[#8b5e34] relative">
            Legacy
            <motion.span 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute -bottom-2 left-0 h-1 bg-[#8b5e34]/20 rounded-full" 
            />
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-[#737373] text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed font-medium"
        >
          A precision-engineered platform utilizing Gemini AI to transform your technical footprint into a high-conversion professional narrative.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/signup" className="group relative btn-primary px-14 py-5 text-xs uppercase tracking-[0.2em] font-black shadow-2xl shadow-[#8b5e34]/30 overflow-hidden rounded-xl">
            <span className="relative z-10">Initialize Studio</span>
            <motion.div 
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-white/10 -translate-x-full skew-x-12" 
            />
          </Link>
          <Link href="/login" className="btn-outline px-14 py-5 text-xs uppercase tracking-[0.2em] font-black hover:bg-[#2d2d2d] hover:text-white transition-all rounded-xl border-2">
            Login Access
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <motion.section 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 py-32 border-t border-[#e5e0d8]"
      >
        <motion.div variants={item}>
          <FlatCard className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white/50 backdrop-blur-sm group">
            <div className="text-[10px] font-black text-[#8b5e34] uppercase tracking-widest mb-8 border-b border-[#f5f2ed] pb-4 flex justify-between">
              <span>01 — Intelligence</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
            </div>
            <h3 className="text-3xl font-bold mb-5 text-[#2d2d2d] font-heading tracking-tight">AI Project Synthesis</h3>
            <p className="text-[#737373] text-base leading-relaxed font-medium opacity-80">Automatically scores and extracts achievements from your GitHub repositories, matching them directly to your target role's requirements.</p>
          </FlatCard>
        </motion.div>
        
        <motion.div variants={item}>
          <FlatCard className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white/50 backdrop-blur-sm group">
            <div className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest mb-8 border-b border-[#f5f2ed] pb-4 flex justify-between">
              <span>02 — Design</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">🎨</span>
            </div>
            <h3 className="text-3xl font-bold mb-5 text-[#2d2d2d] font-heading tracking-tight">Kinetic Interface</h3>
            <p className="text-[#737373] text-base leading-relaxed font-medium opacity-80">Experience a high-fidelity editor with real-time PDF/DOCX previews. Designed for speed, precision, and visual excellence.</p>
          </FlatCard>
        </motion.div>
        
        <motion.div variants={item}>
          <FlatCard className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white/50 backdrop-blur-sm group">
            <div className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-widest mb-8 border-b border-[#f5f2ed] pb-4 flex justify-between">
              <span>03 — Strategy</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">📈</span>
            </div>
            <h3 className="text-3xl font-bold mb-5 text-[#2d2d2d] font-heading tracking-tight">ATS Optimization</h3>
            <p className="text-[#737373] text-base leading-relaxed font-medium opacity-80">Integrated score tracking and keyword tailoring ensuring your documents pass through modern recruitment filters with maximum impact.</p>
          </FlatCard>
        </motion.div>
      </motion.section>

      {/* Social Proof / Stats */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-32 border-t border-[#e5e0d8] flex flex-wrap justify-around gap-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
      >
        <div className="text-center">
          <div className="text-7xl font-bold text-[#2d2d2d] font-heading mb-3 tabular-nums tracking-tighter">12k</div>
          <div className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-[0.4em]">Engineers Empowered</div>
        </div>
        <div className="text-center">
          <div className="text-7xl font-bold text-[#2d2d2d] font-heading mb-3 tabular-nums tracking-tighter">99.8%</div>
          <div className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-[0.4em]">Accuracy Rating</div>
        </div>
        <div className="text-center">
          <div className="text-7xl font-bold text-[#2d2d2d] font-heading mb-3 tabular-nums tracking-tighter">4.9</div>
          <div className="text-[10px] font-black text-[#a3a3a3] uppercase tracking-[0.4em]">Global CSAT Score</div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
