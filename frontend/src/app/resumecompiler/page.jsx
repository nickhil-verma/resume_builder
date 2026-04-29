"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from '@/components/Sidebar';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { generateChatResponse, parseResumeText, rewriteSectionAI, calculateATSScoreAI } from '@/lib/gemini';

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTION_KEYS = ["summary", "experience", "projects", "skills"];

const SECTION_LABELS = {
    summary: "Summary",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
};

const INITIAL_RESUME = {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    jobTitle: "",
    jobDescription: "",
    summary: "",
    experience: "",
    projects: "",
    skills: "",
};


const RESUME_TEMPLATES = [
    {
        id: "swe",
        name: "Software Engineer",
        data: {
            title: "Senior Software Engineer",
            jobTitle: "Senior Software Engineer",
            jobDescription: "Seeking a senior engineering role.",
            summary: "Passionate software engineer with 7+ years of experience building scalable web applications. Skilled in React, Node.js, and cloud infrastructure. Proven track record of delivering high-impact features in fast-paced environments.",
            experience: "Senior Engineer · Acme Corp (2021–Present)\n• Led migration of monolith to microservices, reducing latency by 40%\n• Managed a team of 4 engineers across two time zones\n\nFull-Stack Engineer · Beta Inc (2018–2021)\n• Built core payments pipeline processing $2M/day\n• Reduced CI/CD build times by 60% through parallelization",
            projects: "OpenMetrics — Real-time analytics dashboard (React, ClickHouse, Go)\nResumeAI — AI-powered resume builder used by 10,000+ users\nDevPulse — GitHub activity tracker with Slack integration",
            skills: "Languages: TypeScript, Python, Go, SQL\nFrameworks: React, Next.js, Node.js, FastAPI\nCloud: AWS (EC2, Lambda, S3, RDS), Docker, Kubernetes\nTools: Git, Terraform, Datadog",
        }
    },
    {
        id: "pm",
        name: "Product Manager",
        data: {
            title: "Product Manager",
            jobTitle: "Product Manager",
            jobDescription: "Seeking a product leadership role.",
            summary: "Data-driven Product Manager with 5+ years of experience launching B2B SaaS products. Adept at cross-functional leadership, agile methodologies, and turning user feedback into actionable roadmaps.",
            experience: "Product Manager · TechNova (2020–Present)\n• Launched enterprise dashboard, increasing retention by 25%\n• Led cross-functional team of 12 engineers and designers\n\nAssociate PM · StartUp Inc (2018–2020)\n• Conducted 100+ user interviews to define product roadmap\n• Managed sprint planning and backlog grooming",
            projects: "SaaS Analytics Redesign — Led complete overhaul of analytics suite\nMobile App Launch — Managed 0 to 1 launch of iOS app",
            skills: "Skills: Product Strategy, Agile/Scrum, Wireframing, Data Analysis\nTools: Jira, Figma, SQL, Mixpanel, Tableau",
        }
    },
    {
        id: "data",
        name: "Data Scientist",
        data: {
            title: "Data Scientist",
            jobTitle: "Data Scientist",
            jobDescription: "Seeking a data science role.",
            summary: "Detail-oriented Data Scientist experienced in machine learning, statistical modeling, and data visualization. Proven ability to translate complex data into actionable business insights.",
            experience: "Data Scientist · DataCorp (2021–Present)\n• Developed predictive churn model saving $500k annually\n• Deployed ML models using Docker and AWS SageMaker\n\nData Analyst · Quant LLC (2019–2021)\n• Automated reporting pipelines reducing manual work by 15 hours/week\n• Created interactive Tableau dashboards for executive team",
            projects: "Customer Segmentation — Clustered 1M+ users using K-Means\nSales Forecasting — Time-series forecasting with Prophet",
            skills: "Languages: Python, R, SQL\nLibraries: Pandas, Scikit-Learn, TensorFlow, PyTorch\nTools: Tableau, Docker, AWS",
        }
    },
    {
        id: "ux",
        name: "UX/UI Designer",
        data: {
            title: "Senior UX Designer",
            jobTitle: "Senior UX Designer",
            jobDescription: "Seeking a UX design role.",
            summary: "Creative UX Designer with a strong portfolio of intuitive, user-centered digital products. Expertise in wireframing, prototyping, and user research. Passionate about accessibility.",
            experience: "Senior UX Designer · DesignStudio (2020–Present)\n• Redesigned e-commerce checkout, boosting conversions by 18%\n• Established company-wide design system and component library\n\nUX/UI Designer · WebTech (2017–2020)\n• Conducted A/B testing on landing pages to optimize UX\n• Collaborated closely with front-end developers to ensure fidelity",
            projects: "FinTech Mobile App — End-to-end design of mobile banking app\nHealthcare Portal — Accessible redesign for patient portal",
            skills: "Tools: Figma, Sketch, Adobe Creative Suite, InVision\nSkills: User Research, Wireframing, Prototyping, Accessibility (WCAG)",
        }
    },
    {
        id: "marketing",
        name: "Marketing Manager",
        data: {
            title: "Digital Marketing Manager",
            jobTitle: "Digital Marketing Manager",
            jobDescription: "Seeking a marketing management role.",
            summary: "Results-driven Digital Marketing Manager with 6 years of experience scaling online brand presence. Specialized in SEO, SEM, and performance marketing with a track record of ROI-positive campaigns.",
            experience: "Marketing Manager · BrandCo (2021–Present)\n• Managed $1M+ ad spend across Google and Meta\n• Increased organic traffic by 150% through SEO content strategy\n\nSEO Specialist · GrowthAgency (2018–2021)\n• Optimized technical SEO for 20+ enterprise clients\n• Ran weekly performance audits and keyword research",
            projects: "Q4 Holiday Campaign — Delivered 300% ROI on paid social\nBrand Refresh — Led digital execution of full brand identity refresh",
            skills: "Skills: SEO/SEM, Content Strategy, Email Marketing, Paid Social\nTools: Google Analytics, HubSpot, Mailchimp, SEMrush",
        }
    }
];

// ─── AI Helper ────────────────────────────────────────────────────────────────
async function rewriteSectionWithAI(args) {
    try {
        return await rewriteSectionAI(args);
    } catch (e) {
        console.error("Frontend AI Error, falling back to API:", e);
        const { data } = await api.post('/resume/rewrite', args);
        return data.content;
    }
}


async function rewriteSectionWithAI_OLD({
    sectionName,
    currentContent,
    userInstruction,
    jobTitle,
    jobDescription,
}) {
    try {
        const { data } = await api.post('/resume/rewrite', {
            sectionName,
            currentContent,
            userInstruction,
            jobTitle,
            jobDescription
        });

        if (!data || !data.content) throw new Error("Empty response from AI");
        return data.content;
    } catch (error) {
        console.error("Rewrite Error:", error);
        throw new Error(error.response?.data?.message || "Failed to contact AI Engine");
    }
}

// ─── Auto-Save (simulated PUT /api/resume/:id) ────────────────────────────────

function useAutoSave(data, delay = 1500) {
    const [saveStatus, setSaveStatus] = useState("saved"); // 'saving' | 'saved' | 'error'
    const timerRef = useRef(null);
    const isFirst = useRef(true);

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }
        setSaveStatus("saving");
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(async () => {
            try {
                // Simulate PUT /api/resume/:id
                await new Promise((r) => setTimeout(r, 400));
                setSaveStatus("saved");
            } catch {
                setSaveStatus("error");
            }
        }, delay);
        

    return () => clearTimeout(timerRef.current);
    }, [data, delay]);

    return saveStatus;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconSparkle = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.42 1.42M16.95 16.95l1.42 1.42M5.64 18.36l1.42-1.42M16.95 7.06l1.42-1.42" />
        <circle cx="12" cy="12" r="4" />
    </svg>
);

const IconSend = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const IconX = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const IconCheck = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconLoader = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
        <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
);

// ─── Chat Panel ───────────────────────────────────────────────────────────────

function ChatPanel({ resume, onApplyChange, onClose }) {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hi! Select a section below and tell me how to improve it. I can add metrics, sharpen the language, tailor it to a job, or anything else.",
        },
    ]);
    const [selectedSection, setSelectedSection] = useState("");
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [pendingChange, setPendingChange] = useState(null); // { section, newContent }
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        const instruction = input.trim();
        if (!instruction) return;
        if (!selectedSection) {
            setMessages((m) => [
                ...m,
                { role: "assistant", text: "⚠️ Please select a section first using the tags above." },
            ]);
            return;
        }

        const userMsg = { role: "user", text: instruction, section: selectedSection };
        setMessages((m) => [...m, userMsg]);
        setInput("");
        setLoading(true);
        setPendingChange(null);

        try {
            const improved = await generateChatResponse(messages.map(m => ({ role: m.role, content: m.text })), instruction + "\n\nContext: " + resume[selectedSection]);


            setPendingChange({ section: selectedSection, newContent: improved });
            setMessages((m) => [
                ...m,
                {
                    role: "assistant",
                    text: improved,
                    isProposal: true,
                    section: selectedSection,
                },
            ]);
        } catch (err) {
            setMessages((m) => [
                ...m,
                {
                    role: "assistant",
                    text: `❌ Something went wrong: ${err.message}. Please try again.`,
                },
            ]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleApply = (section, newContent) => {
        onApplyChange(section, newContent);
        setPendingChange(null);
        setMessages((m) =>
            m.map((msg) =>
                msg.isProposal && msg.section === section
                    ? { ...msg, isProposal: false, applied: true }
                    : msg
            )
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!loading) handleSend();
        }
    };

    

    return (
        <div className="fixed bottom-[82px] right-6 z-[200] w-[380px] h-[520px] max-h-[80vh] bg-white rounded-2xl border border-[#e0ddd6] shadow-[0_8px_40px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-[slideUp_0.22s_ease]">
            {/* Header */}
            <div className="flex items-center justify-between py-3 px-4 bg-[#1a1a18] shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#e8c547] shadow-[0_0_6px_#e8c547]" />
                    <span className="text-[#f0ede6] font-semibold text-[13px]">AI Assistant</span>
                </div>
                <button onClick={onClose} className="bg-transparent border-none text-[#888] cursor-pointer p-1 flex items-center hover:text-white" aria-label="Close chat">
                    <IconX />
                </button>
            </div>

            {/* Section selector */}
            <div className="flex gap-1.5 py-2.5 px-3.5 border-b border-[#f0ede6] shrink-0 flex-wrap">
                {SECTION_KEYS.map((key) => (
                    <button
                        key={key}
                        onClick={() => setSelectedSection(key)}
                        className={`py-1 px-2.5 rounded-full text-[12px] font-medium border border-[#e0ddd6] bg-[#fafaf8] text-[#666] cursor-pointer transition-all duration-150 hover:bg-[#f0ede6] ${selectedSection === key ? "bg-[#1a1a18] text-[#e8c547] border-[#1a1a18] hover:bg-[#1a1a18]" : ""}`}
                    >
                        {SECTION_LABELS[key]}
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-3 px-3.5 flex flex-col gap-2.5">
                {messages.map((msg, i) => (
                    <div key={i} style={msg.role === "user" ? styles.userBubbleWrap : styles.aiBubbleWrap}>
                        {msg.role === "user" && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#888] bg-[#f0ede6] py-[2px] px-[7px] rounded-full">{SECTION_LABELS[msg.section]}</span>
                            </div>
                        )}
                        <div style={msg.role === "user" ? styles.userBubble : styles.aiBubble}>
                            <pre className="text-[12.5px] leading-[1.65] font-[family-name:'DM_Sans'] whitespace-pre-wrap break-words">{msg.text}</pre>
                        </div>
                        {msg.isProposal && (
                            <button
                                className="flex items-center gap-1.25 bg-[#e8c547] text-[#1a1a18] border-none rounded-lg py-[5px] px-[11px] text-[12px] font-semibold cursor-pointer font-[family-name:'DM_Sans'] ml-1 hover:bg-[#d4b33d]"
                                onClick={() => handleApply(msg.section, msg.text)}
                            >
                                <IconCheck /> Apply to editor
                            </button>
                        )}
                        {msg.applied && (
                            <span className="text-[11px] text-[#22a84a] font-semibold ml-1">✓ Applied</span>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex flex-col items-start gap-1">
                        <div className="bg-[#f5f4f0] text-[#2a2a27] rounded-[4px_14px_14px_14px] py-[9px] px-[13px] max-w-[90%] flex items-center gap-2 text-[#888]">
                            <IconLoader />
                            <span className="text-[13px] text-[#888]">Rewriting…</span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 py-2.5 px-3 border-t border-[#f0ede6] shrink-0 bg-[#fafaf8]">
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        selectedSection
                            ? `How should I improve ${SECTION_LABELS[selectedSection]}?`
                            : "Select a section above, then ask…"
                    }
                    className="flex-1 border border-[#e0ddd6] rounded-xl py-2 px-[11px] text-[13px] leading-[1.5] resize-none outline-none bg-white text-[#2a2a27] focus:border-[#8b5e34]"
                    rows={2}
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className={`w-[38px] h-[38px] self-end bg-[#1a1a18] text-[#e8c547] border-none rounded-xl cursor-pointer flex items-center justify-center shrink-0 transition-opacity ${loading || !input.trim() ? "opacity-[0.35] cursor-not-allowed hover:opacity-[0.35]" : "hover:opacity-90"}`}
                    aria-label="Send"
                >
                    <IconSend />
                </button>
            </div>
        </div>
    );
}

// ─── Resume Section Editor ────────────────────────────────────────────────────

function SectionEditor({ label, value, onChange, highlight }) {
    

    return (
        <div className={`bg-white rounded-2xl p-6 border border-[#e8e6e0] transition-all duration-[400ms] ease-in-out shadow-[0_4px_15px_rgba(0,0,0,0.02)] ${highlight ? "bg-[#fffbe6] animate-[flashHighlight_1.8s_ease]" : ""}`}>
            <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-[#8b5e34] mb-4 border-b border-[#f5f2ed] pb-3">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-[#e0ddd6] rounded-xl p-4 text-[13px] leading-[1.7] text-[#2d2d2d] bg-[#fdfbf9] resize-y outline-none font-[family-name:'DM_Sans'] focus:border-[#8b5e34]"
                rows={label === "Summary" ? 4 : label === "Skills" ? 4 : 7}
            />
        </div>
    );
}

// ─── Resume Preview ───────────────────────────────────────────────────────────


const FormattedText = ({ text, className }) => {
    if (!text) return null;
    const lines = text.split('\n');
    return (
        <div className={className} style={{ whiteSpace: 'pre-wrap' }}>
            {lines.map((line, i) => {
                const parts = line.split(/(\*\*.*?\*\*)/g);
                const processedLine = parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                });
                return <div key={i}>{processedLine}</div>;
            })}
        </div>
    );
};

function ResumePreview({ resume, templateStyle = 'modern' }) {
    const styles = {
        modern: {
            container: "bg-white rounded p-[60px_70px] border border-[#e8e6e0] min-h-[1100px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col relative overflow-hidden",
            headerAlign: "mb-10 border-b-[3px] border-[#1a1a18] pb-6 flex flex-col",
            name: "font-heading text-[48px] text-[#1a1a18] leading-none tracking-[-0.03em]",
            title: "text-[18px] text-[#8b5e34] mt-2 font-medium",
            contact: "text-[12px] text-[#737373] mt-4 tracking-[0.02em] flex flex-wrap gap-2",
            sectionMargin: "mt-8",
            sectionTitle: "text-[12px] font-extrabold uppercase tracking-[0.15em] text-[#1a1a18] mb-3 pb-1.5 border-b border-[#e5e0d8]",
            sectionContent: "text-[14px] leading-[1.8] text-[#2d2d2d] font-[family-name:'DM_Sans']"
        },
        classic: {
            container: "bg-white p-[60px_70px] border border-[#d1d1d1] min-h-[1100px] flex flex-col relative overflow-hidden font-serif",
            headerAlign: "mb-8 border-b border-black pb-4 flex flex-col text-center items-center",
            name: "font-serif text-[42px] text-black leading-none uppercase tracking-widest",
            title: "text-[16px] text-gray-700 mt-2 font-serif italic",
            contact: "text-[12px] text-gray-800 mt-3 flex flex-wrap justify-center gap-3",
            sectionMargin: "mt-6",
            sectionTitle: "text-[16px] font-bold uppercase tracking-wider text-black mb-2 pb-1 border-b border-gray-400",
            sectionContent: "text-[14px] leading-[1.6] text-gray-800 font-serif"
        },
        minimal: {
            container: "bg-white p-[60px_50px] min-h-[1100px] flex flex-col relative overflow-hidden font-sans",
            headerAlign: "mb-12 flex flex-col items-start",
            name: "font-sans text-[40px] text-gray-900 leading-none font-light tracking-tight",
            title: "text-[16px] text-gray-500 mt-2 font-sans",
            contact: "text-[11px] text-gray-400 mt-3 flex flex-wrap gap-4 uppercase tracking-widest",
            sectionMargin: "mt-8 flex gap-8",
            sectionTitle: "text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 w-[120px] shrink-0 pt-1",
            sectionContent: "text-[13px] leading-[1.8] text-gray-700 font-sans flex-1"
        }
    };
    const s = styles[templateStyle] || styles.modern;
    const renderSection = (title, content) => {
        if (!content) return null;
        return (
            <div className={s.sectionMargin}>
                <div className={s.sectionTitle}>{title}</div>
                <FormattedText className={s.sectionContent} text={content} />
            </div>
        );
    };
    return (
        <div className={s.container}>
            <div className={s.headerAlign}>
                {resume.avatar && (
                    <img src={resume.avatar} alt="Avatar" className="w-[64px] h-[64px] rounded-full object-cover absolute top-[60px] right-[70px] shadow-sm border border-[#e8e6e0]" />
                )}
                <h1 className={s.name}>{resume.name || "Your Name"}</h1>
                <p className={s.title}>{resume.title || "Job Title"}</p>
                <div className={s.contact}>
                    {[resume.email, resume.phone, resume.location].filter(Boolean).map((item, i) => (
                        <span key={i} className="flex items-center">
                            {i > 0 && <span className="mx-2">•</span>}
                            {item}
                        </span>
                    ))}
                    {(resume.linkedin || resume.github) && (
                        <span className="flex items-center">
                            {([resume.email, resume.phone, resume.location].some(Boolean)) && <span className="mx-2">•</span>}
                            <span className="flex gap-2">
                                {resume.linkedin && (
                                    <a href={resume.linkedin.startsWith('http') ? resume.linkedin : `https://${resume.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                                )}
                                {resume.linkedin && resume.github && <span>/</span>}
                                {resume.github && (
                                    <a href={resume.github.startsWith('http') ? resume.github : `https://${resume.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                                )}
                            </span>
                        </span>
                    )}
                </div>
            </div>
            {renderSection("Summary", resume.summary)}
            {renderSection("Experience", resume.experience)}
            {renderSection("Projects", resume.projects)}
            {renderSection("Skills", resume.skills)}
            <div className="mt-auto pt-[60px] text-center text-[10px] text-[#a3a3a3] tracking-[0.2em] font-semibold">1 / 1</div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ResumePage() {
    const [resume, setResume] = useState(INITIAL_RESUME);
    const [resumeId, setResumeId] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [highlightedSection, setHighlightedSection] = useState(null);
    const [activeTab, setActiveTab] = useState("edit"); // 'edit' | 'preview'
    const [templateStyle, setTemplateStyle] = useState("modern");
    const [showParser, setShowParser] = useState(false);
    const [parsing, setParsing] = useState(false);
    const [rawText, setRawText] = useState("");
    const [atsData, setAtsData] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [allResumes, setAllResumes] = useState([]);

    useEffect(() => {
        const fetchEngineData = async () => {
            let userProfile = {};
            let userSocials = {};
            let resumesData = [];

            try {
                const [resumesRes, socialsRes, profileRes] = await Promise.all([
                    api.get('/resume'),
                    api.get('/user/social'),
                    api.get('/user/profile')
                ]);
                resumesData = resumesRes.data || [];
                setAllResumes(resumesData);
                userSocials = socialsRes.data || {};
                userProfile = profileRes.data || {};
            } catch (e) {
                console.error("Failed to fetch dashboard data", e);
            }

            const savedData = localStorage.getItem('compiled_resume');
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    setResume(prev => ({
                        ...prev,
                        ...parsed,
                        name: (parsed.name === "Alex Johnson" ? null : parsed.name) || userProfile.name || prev.name,
                        phone: (parsed.phone === "+1 (555) 000-1234" ? null : parsed.phone) || userProfile.phone || prev.phone,
                        location: (parsed.location === "San Francisco, CA" ? null : parsed.location) || userProfile.location || prev.location,
                        github: parsed.github || userSocials.github || userProfile.githubUrl || prev.github,
                        linkedin: (parsed.linkedin === "linkedin.com/in/alexjohnson" ? null : parsed.linkedin) || userSocials.linkedin || userProfile.linkedinUrl || prev.linkedin,
                    }));
                    // Clean up after consuming
                    localStorage.removeItem('compiled_resume');
                    return;
                } catch (e) {
                    console.error('Failed to parse saved resume data');
                }
            }

            // If no compiled data from builder, act as Compiler Engine: Load the last resume
            if (resumesData && resumesData.length > 0) {
                const urlParams = new URLSearchParams(window.location.search);
                const targetId = urlParams.get('id');
                let targetResume;

                if (targetId) {
                    targetResume = resumesData.find(r => r.id === targetId);
                }

                if (!targetResume) {
                    // Fallback to most recently updated resume
                    targetResume = resumesData.reduce((a, b) => new Date(a.updatedAt) > new Date(b.updatedAt) ? a : b);
                }

                setResumeId(targetResume.id);
                setResume(prev => ({
                    ...prev,
                    name: (targetResume.personalInfo?.name === "Alex Johnson" ? null : targetResume.personalInfo?.name) || userProfile.name || prev.name,
                    email: (targetResume.personalInfo?.email === "alex@example.com" ? null : targetResume.personalInfo?.email) || userProfile.email || prev.email,
                    phone: (targetResume.personalInfo?.phone === "+1 (555) 000-1234" ? null : targetResume.personalInfo?.phone) || userProfile.phone || prev.phone,
                    location: (targetResume.personalInfo?.location === "San Francisco, CA" ? null : targetResume.personalInfo?.location) || userProfile.location || prev.location,
                    linkedin: (targetResume.personalInfo?.linkedin === "linkedin.com/in/alexjohnson" ? null : targetResume.personalInfo?.linkedin) || userSocials.linkedin || userProfile.linkedinUrl || prev.linkedin,
                    github: targetResume.personalInfo?.github || userSocials.github || userProfile.githubUrl || prev.github,
                    jobTitle: targetResume.jobTitle || prev.jobTitle,
                    jobDescription: targetResume.jobDescription || prev.jobDescription,
                    summary: targetResume.summary || prev.summary,
                    experience: Array.isArray(targetResume.experience) ? targetResume.experience.map(e => typeof e === 'string' ? e : `${e.role || ''} · ${e.company || ''} (${e.duration || ''})\n• ${e.description || ''}`).join('\n\n') : targetResume.experience || prev.experience,
                    projects: Array.isArray(targetResume.projects) ? targetResume.projects.map(p => typeof p === 'string' ? p : `${p.name || ''} — ${p.description || ''}`).join('\n') : targetResume.projects || prev.projects,
                    skills: Array.isArray(targetResume.skills) ? targetResume.skills.join('\n') : targetResume.skills || prev.skills,
                }));
            } else if (userProfile.name) {
                setResume(prev => ({
                    ...prev,
                    name: userProfile.name,
                    email: userProfile.email || prev.email,
                    phone: userProfile.phone || prev.phone,
                    location: userProfile.location || prev.location,
                    github: userSocials.github || userProfile.githubUrl || prev.github,
                    linkedin: userSocials.linkedin || userProfile.linkedinUrl || prev.linkedin,
                }));
            }
        };

        fetchEngineData();
    }, []);

    const saveStatus = useAutoSave(resume);
    const resumeRef = useRef();


    
    
    const handleAnalyzeATS = async () => {
        if (!resume.jobDescription) {
            toast.error("Please add a Job Description first!");
            return;
        }
        setAnalyzing(true);
        try {
            const result = await calculateATSScoreAI(resume, resume.jobDescription);
            setAtsData(result);
            toast.success("ATS Analysis complete!");
        } catch (e) {
            toast.error("Failed to analyze ATS match");
        } finally {
            setAnalyzing(false);
        }
    };


    const handleParseResume = async () => {
        if (!rawText.trim()) return;
        setParsing(true);
        try {
            const parsed = await parseResumeText(rawText);
            setResume(prev => ({ ...prev, ...parsed }));
            setShowParser(false);
            setRawText("");
            toast.success("Resume parsed successfully!");
        } catch (e) {
            toast.error("Failed to parse resume content");
        } finally {
            setParsing(false);
        }
    };


    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const size = 64;
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');

                // Keep aspect ratio & cover
                const scale = Math.max(size / img.width, size / img.height);
                const x = (size - img.width * scale) / 2;
                const y = (size - img.height * scale) / 2;

                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

                const base64Data = canvas.toDataURL('image/webp', 0.9);
                updateField('avatar', base64Data);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handlePrint = async () => {
        if (!resumeRef.current) return;

        const wasEdit = activeTab === "edit";
        if (wasEdit) {
            setActiveTab("preview");
            // Wait for React to render the preview tab
            await new Promise(r => setTimeout(r, 100));
        }

        try {
            // Dynamically import html2pdf to avoid SSR issues
            const html2pdf = (await import('html2pdf.js')).default;

            const opt = {
                margin: [0, 0, 0, 0],
                filename: `${resume.name || 'My'} - Resume.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 2, useCORS: true, windowWidth: 840 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().from(resumeRef.current).set(opt).save();
        } catch (err) {
            console.error("PDF generation error:", err);
            toast.error("Failed to generate PDF");
        } finally {
            if (wasEdit) {
                setActiveTab("edit");
            }
        }
    };

    const handleSaveToWorkspace = async () => {
        try {
            const payload = {
                title: resume.name + " (Synthesized)",
                template: "modern",
                personalInfo: {
                    name: resume.name,
                    email: resume.email,
                    phone: resume.phone,
                    location: resume.location,
                    linkedin: resume.linkedin,
                    github: resume.github,
                    avatar: resume.avatar
                },
                summary: resume.summary,
                experience: typeof resume.experience === 'string' ? resume.experience.split('\n\n') : resume.experience,
                projects: typeof resume.projects === 'string' ? resume.projects.split('\n') : resume.projects,
                skills: typeof resume.skills === 'string' ? resume.skills.split('\n') : resume.skills,
                education: [], // Default empty
                sections: [] // Default empty
            };

            if (resumeId) {
                await api.put(`/resume/${resumeId}`, payload);
            } else {
                const { data } = await api.post('/resume', payload);
                setResumeId(data.id);
            }

            toast.success('Saved to workspace!');
        } catch (error) {
            toast.error('Failed to save to workspace');
        }
    };

    const updateField = useCallback((key, value) => {
        setResume((r) => ({ ...r, [key]: value }));
    }, []);

    const handleApplyChange = useCallback((section, newContent) => {
        setResume((r) => ({ ...r, [section]: newContent }));
        setHighlightedSection(section);
        setTimeout(() => setHighlightedSection(null), 2000);
    }, []);

    
    const loadSavedResume = (saved) => {
        setResumeId(saved.id);
        setResume({
            name: saved.personalInfo?.name || "",
            email: saved.personalInfo?.email || "",
            phone: saved.personalInfo?.phone || "",
            location: saved.personalInfo?.location || "",
            linkedin: saved.personalInfo?.linkedin || "",
            github: saved.personalInfo?.github || "",
            avatar: saved.personalInfo?.avatar || "",
            title: saved.personalInfo?.title || saved.title || "",
            jobTitle: saved.jobTitle || "",
            jobDescription: saved.jobDescription || "",
            summary: saved.summary || "",
            experience: Array.isArray(saved.experience) ? saved.experience.map(e => typeof e === "string" ? e : `${e.role || ""} · ${e.company || ""} (${e.duration || ""})\n• ${e.description || ""}`).join("\n\n") : saved.experience || "",
            projects: Array.isArray(saved.projects) ? saved.projects.map(p => typeof p === "string" ? p : `${p.name || ""} — ${p.description || ""}`).join("\n") : saved.projects || "",
            skills: Array.isArray(saved.skills) ? saved.skills.join("\n") : saved.skills || "",
        });
    };

    return (
        <div className="flex-1 bg-[#f5f4f0] min-h-screen">

            <main className="py-10 px-[60px] flex flex-col gap-10 w-full max-w-[1400px] mx-auto">
                {/* Modern Header */}
                <header className="flex items-center justify-between mb-5">
                    <div className="flex flex-col gap-1">
                        <div className="text-[10px] font-black text-[#8b5e34] uppercase tracking-[0.3em]">System — Compiler v2.0</div>
                        <h1 className="text-[42px] font-bold text-[#2d2d2d] font-heading tracking-[-0.02em]">Resume Editor</h1>
                    </div>

                    <div className="flex gap-2 bg-white border border-[#e5e0d8] rounded-xl p-1 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <button
                            className={`px-6 py-2 rounded-lg border-none text-[12px] font-semibold cursor-pointer transition-all duration-200 ${activeTab === "edit" ? "bg-[#1a1a18] text-white shadow-lg" : "bg-transparent text-[#737373] hover:bg-gray-50"}`}
                            onClick={() => setActiveTab("edit")}
                        >
                            Edit
                        </button>
                        <button
                            className={`px-6 py-2 rounded-lg border-none text-[12px] font-semibold cursor-pointer transition-all duration-200 ${activeTab === "preview" ? "bg-[#1a1a18] text-white shadow-lg" : "bg-transparent text-[#737373] hover:bg-gray-50"}`}
                            onClick={() => setActiveTab("preview")}
                        >
                            Preview
                        </button>
                    </div>

                    <div className="flex gap-3 items-center">
                        <select 
                            className="px-3 py-3 rounded-xl border-2 border-[#e5e0d8] bg-white text-[#1a1a18] text-[10px] font-black uppercase tracking-[0.05em] cursor-pointer transition-all duration-200 outline-none hover:border-[#1a1a18] focus:border-[#1a1a18]"
                            value={templateStyle}
                            onChange={(e) => setTemplateStyle(e.target.value)}
                        >
                            <option value="modern">Modern</option>
                            <option value="classic">Classic</option>
                            <option value="minimal">Minimal</option>
                        </select>
                        <select 
                            className="px-3 py-3 rounded-xl border-2 border-[#e5e0d8] bg-transparent text-[#1a1a18] text-[10px] font-black uppercase tracking-[0.05em] cursor-pointer transition-all duration-200 outline-none hover:border-[#1a1a18] focus:border-[#1a1a18]"
                            onChange={(e) => {
                                const tpl = RESUME_TEMPLATES.find(t => t.id === e.target.value);
                                if (tpl) {
                                    if (window.confirm('Load ' + tpl.name + ' template? This will overwrite your current content.')) {
                                        setResume(r => ({ ...r, ...tpl.data }));
                                        toast.success('Template loaded successfully!');
                                    }
                                }
                                e.target.value = "";
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Load Template</option>
                            {RESUME_TEMPLATES.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        {allResumes.length > 0 && (
                            <select 
                                className="px-3 py-3 rounded-xl border-2 border-[#e5e0d8] bg-transparent text-[#1a1a18] text-[10px] font-black uppercase tracking-[0.05em] cursor-pointer transition-all duration-200 outline-none hover:border-[#1a1a18] focus:border-[#1a1a18]"
                                onChange={(e) => {
                                    const saved = allResumes.find(r => r.id === e.target.value);
                                    if (saved) {
                                        if (window.confirm('Load this previous resume? This will overwrite your current progress.')) {
                                            loadSavedResume(saved);
                                            toast.success('Resume loaded!');
                                        }
                                    }
                                    e.target.value = "";
                                }}
                                defaultValue=""
                            >
                                <option value="" disabled>My Resumes</option>
                                {allResumes.map(r => (
                                    <option key={r.id} value={r.id}>{r.title || 'Untitled Resume'}</option>
                                ))}
                            </select>
                        )}
                        <button onClick={handlePrint} className="px-6 py-3 rounded-xl border-2 border-[#1a1a18] bg-transparent text-[#1a1a18] text-[10px] font-black uppercase tracking-[0.1em] cursor-pointer transition-all duration-200 hover:bg-[#1a1a18] hover:text-white">Export PDF</button>
                        <button onClick={handleSaveToWorkspace} className="px-7 py-3 rounded-xl border-none bg-[#1a1a18] text-white text-[10px] font-black uppercase tracking-[0.1em] cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.15)] transition-all duration-200 hover:shadow-[0_15px_35px_rgba(0,0,0,0.2)]">Sync to Cloud</button>
                    </div>
                </header>

                <div className={activeTab === "edit" ? "block" : "hidden"}>
                    <div className="flex gap-5 max-w-[1200px] mx-auto w-full">
                        {/* Left: Meta fields */}
                        <aside className="w-[260px] shrink-0 flex flex-col gap-5">
                            <div className="bg-white rounded-2xl p-6 border border-[#e8e6e0] flex flex-col gap-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                                
                                <button 
                                    onClick={() => setShowParser(true)}
                                    className="w-full py-3 rounded-xl border-2 border-dashed border-[#8b5e34]/30 bg-[#8b5e34]/5 text-[#8b5e34] text-[10px] font-black uppercase tracking-[0.1em] mb-4 hover:bg-[#8b5e34]/10 transition-all"
                                >
                                    ✨ Import Previous Resume
                                </button>

                                <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8b5e34] mb-1 border-b border-[#f5f2ed] pb-3">Personal Info</h3>

                                <div className="flex flex-col gap-1.5 mb-4 border-b border-[#f5f2ed] pb-4">
                                    <label className="text-[10px] font-bold text-[#a3a3a3] uppercase">Avatar (64x64)</label>
                                    <div className="flex items-center gap-3">
                                        {resume.avatar ? (
                                            <img src={resume.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-[#e0ddd6]" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-[#fdfbf9] border border-[#e0ddd6] flex items-center justify-center text-[10px] text-[#a3a3a3]">No Image</div>
                                        )}
                                        <label className="text-[10px] font-black uppercase tracking-[0.1em] text-[#8b5e34] cursor-pointer hover:underline">
                                            Upload
                                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                                        </label>
                                    </div>
                                </div>
                                {[
                                    ["name", "Full Name"],
                                    ["title", "Job Title"],
                                    ["email", "Email"],
                                    ["phone", "Phone"],
                                    ["location", "Location"],
                                    ["linkedin", "LinkedIn"],
                                    ["github", "GitHub"],
                                ].map(([key, label]) => (
                                    <div key={key} className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-bold text-[#a3a3a3] uppercase">{label}</label>
                                        <input
                                            value={resume[key]}
                                            onChange={(e) => updateField(key, e.target.value)}
                                            className="border border-[#e0ddd6] rounded-lg py-2.5 px-3 text-[13px] text-[#2d2d2d] bg-[#fdfbf9] outline-none transition-all duration-200 w-full focus:border-[#8b5e34]"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-[#e8e6e0] flex flex-col gap-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8b5e34] mb-1 border-b border-[#f5f2ed] pb-3">Target Job (for AI)</h3>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-[#a3a3a3] uppercase">Job Title</label>
                                    <input
                                        value={resume.jobTitle}
                                        onChange={(e) => updateField("jobTitle", e.target.value)}
                                        className="border border-[#e0ddd6] rounded-lg py-2.5 px-3 text-[13px] text-[#2d2d2d] bg-[#fdfbf9] outline-none transition-all duration-200 w-full focus:border-[#8b5e34]"
                                        placeholder="e.g. Staff Engineer at Stripe"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-[#a3a3a3] uppercase">Job Description</label>
                                    <textarea
                                        value={resume.jobDescription}
                                        onChange={(e) => updateField("jobDescription", e.target.value)}
                                        className="border border-[#e0ddd6] rounded-lg py-2.5 px-3 text-[13px] text-[#2d2d2d] bg-[#fdfbf9] outline-none transition-all duration-200 w-full focus:border-[#8b5e34] h-[90px] resize-y"
                                        placeholder="Paste JD here for tailored suggestions…"
                                    />
                                </div>
                            
                                <div className="mt-4 p-4 rounded-xl bg-[#1a1a18] text-white shadow-xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.1em] text-[#e8c547]">ATS Match Analytics</h4>
                                        <button onClick={handleAnalyzeATS} disabled={analyzing} className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors uppercase font-bold">
                                            {analyzing ? "Analyzing..." : "Refresh"}
                                        </button>
                                    </div>
                                    {atsData ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center">
                                                <div className="text-[20px] font-bold text-[#e8c547]">{atsData.atsScore}%</div>
                                                <div className="text-[8px] uppercase tracking-wider text-white/50 font-bold">ATS Score</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-[20px] font-bold text-[#e8c547]">{atsData.matchPercentage}%</div>
                                                <div className="text-[8px] uppercase tracking-wider text-white/50 font-bold">JD Match</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-[9px] text-white/40 leading-tight">Add a job description and click Analyze to see your match score.</p>
                                    )}
                                </div>
</div>
                        </aside>

                        {/* Right: Section editors */}
                        <div className="flex-1 flex flex-col gap-5">
                            {SECTION_KEYS.map((key) => (
                                <SectionEditor
                                    key={key}
                                    label={SECTION_LABELS[key]}
                                    value={resume[key]}
                                    onChange={(v) => updateField(key, v)}
                                    highlight={highlightedSection === key}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className={activeTab === "preview" ? "block" : "hidden"}>
                    <div className="max-w-[840px] mx-auto pb-[100px]">
                        <div ref={resumeRef}>
                            <ResumePreview resume={resume} templateStyle={templateStyle} />
                        </div>
                    </div>
                </div>
            </main>

            {/* AI Chat Toggle Button */}
            <button
                onClick={() => setChatOpen((o) => !o)}
                className="fixed bottom-6 right-6 z-[200] flex items-center gap-[7px] bg-[#1a1a18] text-[#e8c547] border border-[#3a3a37] rounded-full py-[10px] pr-[18px] pl-[14px] cursor-pointer font-[family-name:'DM_Sans'] text-[13px] font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-105"
                aria-label="Toggle AI assistant"
            >
                {chatOpen ? <IconX /> : <IconSparkle />}
                <span className="tracking-[-0.01em]">{chatOpen ? "Close" : "Ask AI"}</span>
            </button>

            {/* Chat Panel */}
            {chatOpen && (
                <ChatPanel
                    resume={resume}
                    onApplyChange={handleApplyChange}
                    onClose={() => setChatOpen(false)}
                />
            )}
        </div>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────


const styles = {
    root: {
        minHeight: "100vh",
        background: "#f5f4f0",
        display: "flex",
    },

    main: {
        flex: 1,
        padding: "40px 60px",
        display: "flex",
        flexDirection: "column",
        gap: 40
    },

    editorLayout: { display: "flex", gap: 20, maxWidth: 1200, margin: "0 auto", width: "100%" },

    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    headerLeft: { display: "flex", flexDirection: "column", gap: 4 },
    badge: {
        fontSize: 10,
        fontWeight: 900,
        color: "#8b5e34",
        textTransform: "uppercase",
        letterSpacing: "0.3em"
    },
    title: {
        fontSize: 42,
        fontWeight: 700,
        color: "#2d2d2d",
        fontFamily: "'Instrument Serif', serif",
        letterSpacing: "-0.02em"
    },

    headerCenter: {
        display: "flex",
        gap: 8,
        background: "#fff",
        border: "1px solid #e5e0d8",
        borderRadius: 12,
        padding: 4,
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
    },
    tabBtn: {
        padding: "8px 24px", borderRadius: 8, border: "none",
        background: "transparent", color: "#737373", fontSize: 12, fontWeight: 600,
        cursor: "pointer", transition: "all .2s",
    },
    tabBtnActive: { background: "#1a1a18", color: "#fff" },

    headerRight: { display: "flex", gap: 12 },
    iconBtn: {
        padding: "12px 24px",
        borderRadius: 12,
        border: "2px solid #1a1a18",
        background: "transparent",
        color: "#1a1a18",
        fontSize: 10,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        cursor: "pointer",
        transition: "all .2s"
    },
    primaryBtn: {
        padding: "12px 28px",
        borderRadius: 12,
        border: "none",
        background: "#1a1a18",
        color: "#fff",
        fontSize: 10,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        cursor: "pointer",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        transition: "all .2s"
    },

    // Sidebar (Internal)
    sidebar: {
        width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20,
    },
    sidebarSection: {
        background: "#fff", borderRadius: 16, padding: 24,
        border: "1px solid #e8e6e0", display: "flex", flexDirection: "column", gap: 16,
        boxShadow: "0 4px 15px rgba(0,0,0,0.02)"
    },
    sidebarTitle: {
        fontSize: 10, fontWeight: 900, textTransform: "uppercase",
        letterSpacing: "0.15em", color: "#8b5e34", marginBottom: 4,
        borderBottom: "1px solid #f5f2ed", paddingBottom: 12
    },
    fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
    fieldLabel: { fontSize: 10, fontWeight: 700, color: "#a3a3a3", textTransform: "uppercase" },
    fieldInput: {
        border: "1px solid #e0ddd6", borderRadius: 8, padding: "10px 12px",
        fontSize: 13, color: "#2d2d2d", background: "#fdfbf9",
        outline: "none", transition: "all .2s",
        width: "100%",
    },

    // Editor main
    editorMain: { flex: 1, display: "flex", flexDirection: "column", gap: 20 },
    sectionBlock: {
        background: "#fff", borderRadius: 16, padding: 24,
        border: "1px solid #e8e6e0",
        transition: "all .4s ease",
        boxShadow: "0 4px 15px rgba(0,0,0,0.02)"
    },
    sectionHighlight: { animation: "flashHighlight 1.8s ease" },
    sectionLabel: {
        display: "block", fontSize: 10, fontWeight: 900,
        textTransform: "uppercase", letterSpacing: "0.15em", color: "#8b5e34", marginBottom: 16,
        borderBottom: "1px solid #f5f2ed", paddingBottom: 12
    },
    sectionTextarea: {
        width: "100%", border: "1px solid #e0ddd6", borderRadius: 12,
        padding: "16px", fontSize: 13, lineHeight: 1.7, color: "#2d2d2d",
        background: "#fdfbf9", resize: "vertical", outline: "none",
        fontFamily: "'DM Sans', sans-serif",
    },

    // Preview
    previewContainer: { maxWidth: 840, margin: "0 auto", paddingBottom: 100 },
    previewSheet: {
        background: "#fff", borderRadius: 4, padding: "60px 70px",
        border: "1px solid #e8e6e0", minHeight: 1100,
        boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
        display: "flex", flexDirection: "column"
    },
    previewHeader: { marginBottom: 40, borderBottom: "3px solid #1a1a18", paddingBottom: 24 },
    previewName: {
        fontFamily: "'Instrument Serif', serif", fontSize: 48, color: "#1a1a18",
        lineHeight: 1, letterSpacing: "-0.03em",
    },
    previewTitle: { fontSize: 18, color: "#8b5e34", marginTop: 8, fontWeight: 500 },
    previewContact: { fontSize: 12, color: "#737373", marginTop: 16, letterSpacing: "0.02em" },
    previewSection: { marginTop: 32 },
    previewSectionTitle: {
        fontSize: 12, fontWeight: 800, textTransform: "uppercase",
        letterSpacing: "0.15em", color: "#1a1a18", marginBottom: 12,
        paddingBottom: 6, borderBottom: "1px solid #e5e0d8",
    },
    previewBody: { fontSize: 14, lineHeight: 1.8, color: "#2d2d2d" },
    previewPre: {
        fontSize: 14, lineHeight: 1.8, color: "#2d2d2d",
        fontFamily: "'DM Sans', sans-serif", whiteSpace: "pre-wrap", wordBreak: "break-word",
    },

    // Chat toggle button (Overridden/Modified)
    chatToggle: {
        position: "fixed", bottom: 24, right: 24, zIndex: 200,
        display: "flex", alignItems: "center", gap: 7,
        background: "#1a1a18", color: "#e8c547",
        border: "1px solid #3a3a37", borderRadius: 50,
        padding: "10px 18px 10px 14px", cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        transition: "all .2s",
    },
    chatToggleLabel: { letterSpacing: "-0.01em" },

    // Chat panel
    chatPanel: {
        position: "fixed", bottom: 82, right: 24, zIndex: 200,
        width: 380, height: 520, maxHeight: "80vh",
        background: "#fff", borderRadius: 16,
        border: "1px solid #e0ddd6",
        boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        animation: "slideUp .22s ease",
    },
    chatHeader: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px", background: "#1a1a18", flexShrink: 0,
    },
    chatHeaderLeft: { display: "flex", alignItems: "center", gap: 8 },
    chatHeaderDot: {
        width: 8, height: 8, borderRadius: "50%", background: "#e8c547",
        boxShadow: "0 0 6px #e8c547",
    },
    chatHeaderTitle: { color: "#f0ede6", fontWeight: 600, fontSize: 13 },
    chatClose: {
        background: "none", border: "none", color: "#888",
        cursor: "pointer", padding: 4, display: "flex", alignItems: "center",
    },

    // Section bar
    sectionBar: {
        display: "flex", gap: 6, padding: "10px 14px",
        borderBottom: "1px solid #f0ede6", flexShrink: 0, flexWrap: "wrap",
    },
    sectionTag: {
        padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
        border: "1px solid #e0ddd6", background: "#fafaf8", color: "#666",
        cursor: "pointer", transition: "all .15s",
    },
    sectionTagActive: {
        background: "#1a1a18", color: "#e8c547", borderColor: "#1a1a18",
    },

    // Messages
    chatMessages: {
        flex: 1, overflowY: "auto", padding: "12px 14px",
        display: "flex", flexDirection: "column", gap: 10,
    },
    userBubbleWrap: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 },
    aiBubbleWrap: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 },
    userMeta: { display: "flex", alignItems: "center", gap: 6 },
    sectionPill: {
        fontSize: 10, fontWeight: 600, textTransform: "uppercase",
        letterSpacing: "0.06em", color: "#888", background: "#f0ede6",
        padding: "2px 7px", borderRadius: 10,
    },
    userBubble: {
        background: "#1a1a18", color: "#f0ede6",
        borderRadius: "14px 4px 14px 14px",
        padding: "9px 13px", maxWidth: "85%",
    },
    aiBubble: {
        background: "#f5f4f0", color: "#2a2a27",
        borderRadius: "4px 14px 14px 14px",
        padding: "9px 13px", maxWidth: "90%",
    },
    loadingBubble: {
        display: "flex", alignItems: "center", gap: 8, color: "#888",
    },
    bubbleText: {
        fontSize: 12.5, lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif",
        whiteSpace: "pre-wrap", wordBreak: "break-word",
    },
    applyBtn: {
        display: "flex", alignItems: "center", gap: 5,
        background: "#e8c547", color: "#1a1a18",
        border: "none", borderRadius: 8, padding: "5px 11px",
        fontSize: 12, fontWeight: 600, cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        marginLeft: 4,
    },
    appliedBadge: {
        fontSize: 11, color: "#22a84a", fontWeight: 600, marginLeft: 4,
    },

    // Input row
    chatInputRow: {
        display: "flex", gap: 8, padding: "10px 12px",
        borderTop: "1px solid #f0ede6", flexShrink: 0,
        background: "#fafaf8",
    },
    chatInput: {
        flex: 1, border: "1px solid #e0ddd6", borderRadius: 10,
        padding: "8px 11px", fontSize: 13, lineHeight: 1.5,
        resize: "none", outline: "none", background: "#fff",
        color: "#2a2a27",
    },
    sendBtn: {
        width: 38, height: 38, alignSelf: "flex-end",
        background: "#1a1a18", color: "#e8c547",
        border: "none", borderRadius: 10, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "opacity .15s",
    },
    sendBtnDisabled: { opacity: 0.35, cursor: "not-allowed" },
};