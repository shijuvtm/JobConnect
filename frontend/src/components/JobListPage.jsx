import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function JobListPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // --- New State for Search ---
  const [searchQuery, setSearchQuery] = useState("");
  
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    fetch(`${API_URL}/jobs`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.clear();
          navigate("/login");
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then(data => {
        setJobs(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch jobs:", err);
        setIsLoading(false);
      });
  }, [navigate]);

  // --- Search Logic ---
  // This filters jobs by title, company, or location in real-time
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
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


      <main className="mx-auto w-full max-w-7xl px-6 py-8 flex-1">
        
        {/* --- SEARCH BAR SECTION --- */}
        <div className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm shadow-sm transition-all"
              placeholder="Search by job title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-400">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Recommended Jobs"}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {isLoading ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse rounded-xl border bg-white p-6 h-40">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              </div>
            ))
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
               <p className="text-gray-500 font-medium">No Jobs found matching your criteria.</p>
               <button onClick={() => setSearchQuery("")} className="mt-2 text-blue-600 text-sm hover:underline">Clear search</button>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div key={job.id} className="rounded-xl border-2 border-gray-200 bg-white p-6 transition-all hover:shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{job.title}</h3>
                    <p className="mt-1 text-sm font-medium text-gray-600">{job.company}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">New</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <span className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5">📍 {job.location}</span>
                  <span className="flex items-center gap-1 rounded-md bg-blue-50 text-blue-700 px-3 py-1.5 border border-blue-100">💼 {job.experience} Years</span>
                  <span className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5">💰 {job.salary_range}</span>
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <span className="text-xs text-gray-400">{new Date(job.posted_on).toLocaleDateString()}</span>
                  <NavLink to={`/apply/${job.id}`} className="text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1">
                    View Details <span>→</span>
                  </NavLink>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="border-t bg-gray-800 mt-12 py-8 text-center">
        <p className="text-sm text-white">
          © 2026 <span className="font-semibold text-blue-700">JobConnect</span>.com | All rights reserved
        </p>
      </footer>
    </div>
  );
}
