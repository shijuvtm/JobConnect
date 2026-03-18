import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../config';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function JobListPage() {
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  
 
  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [profileRes, jobsRes] = await Promise.all([
        fetch(`${API_URL}/my-profile`, { headers }),
        fetch(`${API_URL}/jobs`, { headers })
      ]);

      const [profileData, jobsData] = await Promise.all([
        profileRes.ok ? profileRes.json() : null,
        jobsRes.ok ? jobsRes.json() : []
      ]);

      setProfile(profileData);
      setJobs(jobsData);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fullResumeUrl = profile?.resume ? `https://jobconnect-1ofu.onrender.com/${profile.resume}` : null;

  const handleUpload = async () => {
    const token = localStorage.getItem("access");
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.put(`${API_URL}/update-resume`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (p) => setUploadProgress(Math.round((p.loaded * 100) / p.total)),
      });
      alert("Resume updated!");
      setProfile(prev => ({ ...prev, resume: res.data.resume }));
      setFile(null);
      setUploadProgress(0);
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
    <h1 className="text-xl font-bold text-blue-700">JobConnect</h1>

    {/* Desktop Nav */}
    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
      <NavLink to="/jobs" className="hover:text-blue-700 transition">Jobs</NavLink>
      <NavLink to="/services" className="hover:text-blue-700 transition">Services</NavLink>
      <NavLink to="/application" className="hover:text-blue-700 transition">My Applications</NavLink>
      <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="hover:text-blue-700 transition">Logout</button>
    </nav>

    <div className="flex items-center gap-4">
      {/* User Info (Hidden on very small screens to save space) */}
      <span className="hidden sm:inline text-sm text-gray-600 font-medium">Hello, {username}</span>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 border border-blue-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      </div>

      {/* MOBILE TOGGLE BUTTON */}
      <button
        className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
    </div>
  </div>

  {/* MOBILE MENU - Fixed positioning to ensure it's on top */}
  {isMenuOpen && (
    <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-xl z-50">
      <nav className="flex flex-col p-4 space-y-4">
        <NavLink
          to="/jobs"
          onClick={() => setIsMenuOpen(false)}
          className="text-base font-semibold text-gray-700 hover:text-blue-700 py-2 border-b border-gray-50"
        >
          Jobs
        </NavLink>
        <NavLink
          to="/services"
          onClick={() => setIsMenuOpen(false)}
          className="text-base font-semibold text-gray-700 hover:text-blue-700 py-2 border-b border-gray-50"
        >
          Services
        </NavLink>
        <NavLink
          to="/application"
          onClick={() => setIsMenuOpen(false)}
          className="text-base font-semibold text-gray-700 hover:text-blue-700 py-2 border-b border-gray-50"
        >
          My Applications
        </NavLink>
        <button
          onClick={() => { localStorage.clear(); navigate("/login"); }}
          className="text-left text-base font-semibold text-red-600 py-2"
        >
          Logout
        </button>
      </nav>
    </div>
  )}
</header>
      <main className="max-w-7xl mx-auto w-full p-4 lg:p-8 grid lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="text-center border-b pb-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                {username[0]}
              </div>
              <h2 className="font-bold text-gray-800 text-lg">{username}</h2>
              <p className="text-sm text-gray-500">{profile?.degree || "Candidate"}</p>
            </div>

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Resume Management</h3>
            
            <div className="mb-4">
               {file ? (
                 <div className="border rounded-lg overflow-hidden bg-gray-50 p-2">
                    <p className="text-xs font-medium text-blue-600 mb-1">Previewing New Upload:</p>
                    <Document file={file}><Page pageNumber={1} width={250} /></Document>
                 </div>
               ) : fullResumeUrl ? (
                 <iframe src={fullResumeUrl} className="w-full h-48 rounded-lg border shadow-inner" title="Resume" />
               ) : (
                 <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-lg text-gray-400 text-xs">No resume found</div>
               )}
            </div>

            <div 
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); setDragActive(false); }}
              className={`p-4 border-2 border-dashed rounded-xl text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            >
              <input type="file" id="resume-up" hidden accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
              <label htmlFor="resume-up" className="cursor-pointer text-xs text-gray-500">
                {file ? file.name : "Drag PDF or click to browse"}
              </label>
            </div>

            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
                <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}

            <button 
              onClick={handleUpload}
              disabled={!file}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm disabled:opacity-50 hover:bg-blue-700 transition"
            >
              Update Resume
            </button>
          </div>
        </aside>

        <section className="lg:col-span-8">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search by title, company, or location..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              [1, 2, 3].map(n => <div key={n} className="h-32 bg-gray-200 animate-pulse rounded-xl" />)
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={job.id} 
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                      <p className="text-blue-600 font-medium">{job.company}</p>
                    </div>
                    <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md font-bold">Active</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                    <span>📍 {job.location}</span>
                    <span>💼 {job.experience} Yrs</span>
                    <span>💰 {job.salary_range}</span>
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-xs text-gray-400">{new Date(job.posted_on).toLocaleDateString()}</span>
                    <NavLink to={`/apply/${job.id}`} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition">
                      View Application →
                    </NavLink>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed">
                <p className="text-gray-500">No jobs found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

