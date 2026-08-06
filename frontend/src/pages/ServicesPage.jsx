import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cpu, BarChart3, FileText, Sparkles, Rocket, Copy, Check } from 'lucide-react';
import { API_URL } from '../config';

export default function ServicesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  // Form Inputs
  const [resumeText, setResumeText] = useState("");
  const [interviewRole, setInterviewRole] = useState("");
  const [userSkills, setUserSkills] = useState("");
  const [targetJob, setTargetJob] = useState("");
  const [resumeDetails, setResumeDetails] = useState("");

  // Result & UI States
  const [activeResult, setActiveResult] = useState("");
  const [resultTitle, setResultTitle] = useState("");
  const [loadingType, setLoadingType] = useState(""); // 'resume' | 'interview' | 'skills' | 'builder' | ''
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // API Call Handlers
  const handleResumeCheck = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    setLoadingType("resume");
    setActiveResult("");
    setResultTitle("AI Resume Checker Analysis");

    try {
      const res = await axios.post(`${API_URL}/api/resume-check/`, {
        resume: resumeText
      });
      setActiveResult(res.data.result);
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setActiveResult("Error fetching response. Make sure the backend server is running and API keys are set.");
    } finally {
      setLoadingType("");
    }
  };

  const handleMockInterview = async (e) => {
    e.preventDefault();
    if (!interviewRole.trim()) return;
    setLoadingType("interview");
    setActiveResult("");
    setResultTitle("AI Mock Interview Questions");

    try {
      const res = await axios.post(`${API_URL}/api/mock-interview/`, {
        role: interviewRole
      });
      setActiveResult(res.data.questions);
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setActiveResult("Error fetching response. Make sure the backend server is running and API keys are set.");
    } finally {
      setLoadingType("");
    }
  };

  const handleSkillGap = async (e) => {
    e.preventDefault();
    if (!userSkills.trim() || !targetJob.trim()) return;
    setLoadingType("skills");
    setActiveResult("");
    setResultTitle("AI Skill Gap Analysis & Roadmap");

    try {
      const res = await axios.post(`${API_URL}/api/skill-gap/`, {
        skills: userSkills,
        job: targetJob
      });
      setActiveResult(res.data.analysis);
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setActiveResult("Error fetching response. Make sure the backend server is running and API keys are set.");
    } finally {
      setLoadingType("");
    }
  };

  const handleResumeBuild = async (e) => {
    e.preventDefault();
    if (!resumeDetails.trim()) return;
    setLoadingType("builder");
    setActiveResult("");
    setResultTitle("AI Generated Resume Draft");

    try {
      const res = await axios.post(`${API_URL}/api/build-resume/`, {
        details: resumeDetails
      });
      setActiveResult(res.data.resume);
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setActiveResult("Error fetching response. Make sure the backend server is running and API keys are set.");
    } finally {
      setLoadingType("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* HEADER */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-blue-700">
            <NavLink to="/">JobConnect</NavLink>
          </h1>

          <nav className="hidden md:flex text-sm font-medium text-gray-700 items-center">
            <NavLink to="/jobs" className="hover:text-blue-700 transition px-6">Jobs</NavLink>
            <NavLink to="/services" className="hover:text-blue-700 transition px-6">Services</NavLink>
            <NavLink to="/application" className="hover:text-blue-700 transition px-6">My Applications</NavLink>
            <NavLink to="/login" onClick={() => { localStorage.clear(); }} className="hover:text-blue-700 transition px-6">Logout</NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-1 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            <span className="hidden sm:inline text-sm text-gray-600 font-medium">Hello, {username}</span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden border-t bg-white px-4 py-4 space-y-3 shadow-inner">
            <NavLink to="/jobs" className="block text-sm font-medium text-gray-700 hover:text-blue-700">Jobs</NavLink>
            <NavLink to="/services" className="block text-sm font-medium text-gray-700 hover:text-blue-700">Services</NavLink>
            <NavLink to="/application" className="block text-sm font-medium text-gray-700 hover:text-blue-700">My Applications</NavLink>
            <NavLink to="/login" onClick={() => { localStorage.clear(); }} className="block text-sm font-medium text-gray-700 hover:text-blue-700">Logout</NavLink>
          </nav>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-blue-700 text-white py-16 px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <Sparkles className="absolute top-10 left-10 w-20 h-20" />
          <Rocket className="absolute bottom-10 right-10 w-24 h-24" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Smart Career Services <span className="text-blue-200">🚀</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto font-medium leading-relaxed">
            AI-powered tools designed to refine your resume, master your interviews,
            and accelerate your professional journey.
          </p>
        </div>
      </section>

      {/* SERVICES FORM SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">

          {/* AI Resume Checker */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Cpu size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">AI Resume Checker</h2>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Upload or paste your resume text and get instant AI scoring, keyword suggestions, and improvement tips.
              </p>

              <form onSubmit={handleResumeCheck} className="space-y-3">
                <textarea
                  rows="4"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your raw resume text here..."
                  className="w-full text-sm p-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loadingType === 'resume'}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors disabled:bg-slate-400"
                >
                  {loadingType === 'resume' ? "Analyzing..." : "Check Resume"}
                </button>
              </form>
            </div>
          </div>

          {/* AI Mock Interview - navigates to voice interview page */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">AI Mock Interview</h2>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Speak your answers and get real-time AI feedback. Simulates a real interview with 5 progressive questions and a final scorecard.
              </p>
              <button
                onClick={() => navigate('/voice-interview')}
                className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                🎤 Start Voice Interview
              </button>
            </div>
          </div>

          {/* Skill Gap Analyzer */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Skill Gap Analyzer</h2>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Compare your current skills with a target job to discover missing technologies and request a roadmap.
              </p>

              <form onSubmit={handleSkillGap} className="space-y-3">
                <input
                  type="text"
                  value={userSkills}
                  onChange={(e) => setUserSkills(e.target.value)}
                  placeholder="Your current skills (e.g. React, Node.js, SQL)"
                  className="w-full text-sm p-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  type="text"
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                  placeholder="Target Job Title (e.g. Senior Full Stack Engineer)"
                  className="w-full text-sm p-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loadingType === 'skills'}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-purple-600 transition-colors disabled:bg-slate-400"
                >
                  {loadingType === 'skills' ? "Analyzing..." : "Analyze Skills"}
                </button>
              </form>
            </div>
          </div>

          {/* Smart Resume Builder */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                <FileText size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Smart Resume Builder</h2>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Create a professional formatted resume draft. Input your basic details, experience, and projects.
              </p>

              <form onSubmit={handleResumeBuild} className="space-y-3">
                <textarea
                  rows="4"
                  value={resumeDetails}
                  onChange={(e) => setResumeDetails(e.target.value)}
                  placeholder="e.g. Name: Shiju, Skills: MERN Stack, Exp: Fresher. Built a job application project."
                  className="w-full text-sm p-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loadingType === 'builder'}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors disabled:bg-slate-400"
                >
                  {loadingType === 'builder' ? "Drafting..." : "Build Resume"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* RESULT DISPLAY */}
      <section id="result-section" className="max-w-4xl mx-auto px-6 pb-20">
        {loadingType && (
          <div className="flex flex-col items-center justify-center py-10 bg-white border rounded-[24px] p-6 shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-blue-700 font-semibold animate-pulse text-sm">Processing AI request... Please wait</p>
          </div>
        )}

        {activeResult && (
          <div className="bg-white border rounded-[24px] p-6 shadow-sm transition-all duration-300">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Sparkles className="text-amber-500 w-5 h-5" />
                {resultTitle}
              </h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border hover:bg-slate-50 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">
                {activeResult}
              </pre>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
