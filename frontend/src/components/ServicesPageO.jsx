import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import { Cpu, BarChart3, FileText, Sparkles, Rocket } from 'lucide-react';

export default function ServicesPageO() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // AI states
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===============================
     API FUNCTIONS
  ============================== */

  const checkResume = async () => {
    setLoading(true);
    setResult("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/resume-check/", {
        resume: "I am a MERN stack developer with Node.js, React, MongoDB experience"
      });

      setResult(res.data.result);
    } catch (err) {
      setResult("Error fetching AI response");
    }

    setLoading(false);
  };

  const startInterview = async () => {
    setLoading(true);
    setResult("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/mock-interview/", {
        role: "Software Developer"
      });

      setResult(res.data.questions);
    } catch (err) {
      setResult("Error fetching AI response");
    }

    setLoading(false);
  };

  const analyzeSkills = async () => {
    setLoading(true);
    setResult("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/skill-gap/", {
        skills: "React, Node.js, MongoDB",
        job: "Full Stack Developer"
      });

      setResult(res.data.analysis);
    } catch (err) {
      setResult("Error fetching AI response");
    }

    setLoading(false);
  };

  const buildResume = async () => {
    setLoading(true);
    setResult("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/build-resume/", {
        details: "Name: Shiju, Skills: MERN Stack, Experience: Fresher"
      });

      setResult(res.data.resume);
    } catch (err) {
      setResult("Error fetching AI response");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="text-2xl font-bold text-blue-700">
            <NavLink to="/">JobConnect</NavLink>
          </div>

          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
            <NavLink to="/job">Jobs</NavLink>
            <NavLink to="/services1">Services</NavLink>
            <NavLink to="/Application">APPLICATION</NavLink>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            ☰
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden px-6 py-4 space-y-4">
            <NavLink to="/job">Jobs</NavLink>
            <NavLink to="/services1">Services</NavLink>
            <NavLink to="/Application">Application</NavLink>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="bg-blue-700 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Smart Career Services 🚀
        </h1>
        <p>
          AI-powered tools to boost your career
        </p>
      </section>

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {/* Resume Checker */}
          <div className="bg-white p-6 rounded-xl shadow">
            <Cpu className="mb-4" />
            <h2 className="font-bold text-lg mb-2">AI Resume Checker</h2>
            <button onClick={checkResume} className="btn">
              Check Resume
            </button>
          </div>

          {/* Mock Interview */}
          <div className="bg-white p-6 rounded-xl shadow">
            <BarChart3 className="mb-4" />
            <h2 className="font-bold text-lg mb-2">AI Mock Interview</h2>
            <button onClick={startInterview} className="btn">
              Start Interview
            </button>
          </div>

          {/* Skill Gap */}
          <div className="bg-white p-6 rounded-xl shadow">
            <BarChart3 className="mb-4" />
            <h2 className="font-bold text-lg mb-2">Skill Gap Analyzer</h2>
            <button onClick={analyzeSkills} className="btn">
              Analyze Skills
            </button>
          </div>

          {/* Resume Builder */}
          <div className="bg-white p-6 rounded-xl shadow">
            <FileText className="mb-4" />
            <h2 className="font-bold text-lg mb-2">Resume Builder</h2>
            <button onClick={buildResume} className="btn">
              Build Resume
            </button>
          </div>

        </div>
      </section>

      {/* RESULT DISPLAY */}
      <div className="max-w-4xl mx-auto px-6 pb-20">

        {loading && (
          <p className="text-blue-600 font-bold text-center">
            Loading AI...
          </p>
        )}

        {result && (
          <div className="bg-white p-6 rounded-xl shadow mt-6">
            <h3 className="font-bold mb-4">AI Result</h3>
            <pre className="whitespace-pre-wrap text-sm">
              {result}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
}
