import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, Cpu, BarChart3, FileText, Sparkles } from 'lucide-react';

export default function ServicesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleServiceClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700 tracking-tight">JobConnect</h1>

          <nav className="hidden md:flex gap-8 font-semibold text-sm text-slate-600">
            <NavLink to="/job" className={({isActive}) => isActive ? "text-blue-700" : "hover:text-blue-700 transition-colors"}>Jobs</NavLink>
            <NavLink to="/company" className={({isActive}) => isActive ? "text-blue-700" : "hover:text-blue-700 transition-colors"}>Companies</NavLink>
            <NavLink to="/login" className="hover:text-blue-700 transition-colors">Login</NavLink>
          </nav>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 md:hidden">
            <div className="absolute right-0 top-0 h-full w-72 bg-white p-8 shadow-2xl animate-in slide-in-from-right duration-300">
              <button onClick={() => setMenuOpen(false)} className="mb-8 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
              <nav className="flex flex-col gap-6 text-lg font-bold text-slate-800">
                <NavLink to="/job" onClick={() => setMenuOpen(false)}>Jobs</NavLink>
                <NavLink to="/company" onClick={() => setMenuOpen(false)}>Companies</NavLink>
                <NavLink to="/login" onClick={() => setMenuOpen(false)}>Login</NavLink>
              </nav>
            </div>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden bg-blue-700 text-white py-20 px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
            <Sparkles className="absolute top-10 left-10 w-20 h-20" />
            <Rocket className="absolute bottom-10 right-10 w-24 h-24" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Smart Career Services <span className="text-blue-200">🚀</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium leading-relaxed">
            AI-powered tools designed to refine your resume, master your interviews,
            and accelerate your professional journey.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

          <div className="group bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <Cpu size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">AI Resume Checker</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Upload your resume and get instant AI scoring, keyword suggestions, and ATS optimization tips to beat the bots.
            </p>
            <button 
              onClick={handleServiceClick}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200"
            >
              Check Resume
            </button>
          </div>

          <div className="group bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
              <BarChart3 size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">AI Mock Interview</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Practice HR and technical interviews with industry-specific questions and get real-time tone and content feedback.
            </p>
            <button 
              onClick={handleServiceClick}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-slate-200"
            >
              Start Interview
            </button>
          </div>

          <div className="group bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <BarChart3 size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Skill Gap Analyzer</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Compare your current tech stack with trending job requirements and receive a personalized learning roadmap.
            </p>
            <button 
              onClick={handleServiceClick}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-purple-600 transition-colors shadow-lg shadow-slate-200"
            >
              Analyze Skills
            </button>
          </div>

          <div className="group bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
              <FileText size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Smart Resume Builder</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Create professional, high-conversion resumes using AI-curated templates designed for modern tech companies.
            </p>
            <button 
              onClick={handleServiceClick}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-slate-200"
            >
              Build Resume
            </button>
          </div>

        </div>
      </section>

      <section className="bg-slate-900 py-20 text-center px-6 mt-10 rounded-t-[60px]">
        <h3 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-tight">
          Ready to level up your career?
        </h3>
        <NavLink
          to="/register"
          className="inline-flex items-center justify-center bg-blue-600 text-white px-10 py-5 rounded-3xl font-bold text-lg hover:bg-blue-500 hover:-translate-y-1 transition-all shadow-xl shadow-blue-500/20"
        >
          Get Started Now
        </NavLink>
      </section>
    </div>
  );
}
