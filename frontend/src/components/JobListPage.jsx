import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
export default function JobListPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const username = localStorage.getItem("username");
  
 useEffect(() => {
    const token = localStorage.getItem("access");

    // 🔒 If no token → force login
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);

    fetch("http://127.0.0.1:8000/jobs", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => {
        // 🔒 Token expired / invalid
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
 
 return (
    <div className="min-h-screen flex flex-col bg-gray-800">
            <header className="border-b bg-white sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-blue-700">JobConnect</h1>

          <nav className="hidden md:flex text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-blue-700 transition px-12">Jobs</a>
            <a href="#" className="hover:text-blue-700 transition px-30">Companies</a>
            <a href="#" className="hover:text-blue-700 transition ">My Applications</a>
            <NavLink to="/register" className="hover:text-blue-700 transition"> Logout </NavLink>
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

            <span className="hidden sm:inline text-sm text-gray-600 font-medium">Hello ,{username}</span>
            
            {/* Login Symbol / User Icon */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden border-t bg-white px-4 py-4 space-y-3 shadow-inner">
            <a href="#" className="block text-sm font-medium text-gray-700 hover:text-blue-700">Jobs</a>
            <a href="#" className="block text-sm font-medium text-gray-700 hover:text-blue-700">Companies</a>
            <a href="#" className="block text-sm font-medium text-gray-700 hover:text-blue-700">My Applications</a>
            <NavLink to={"/register"} className="block text-sm font-medium text-gray-700 hover:text-blue-700">Logout </NavLink>
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8 flex-1">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-400">Recommended Jobs</h2>
        </div>

        <div className="grid grid-cols-1 gap-5">
          
          {isLoading ? (
            // SKELETON LOADING STATE
            [1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse rounded-xl border bg-white p-6 h-40">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-100 rounded w-20"></div>
                  <div className="h-8 bg-gray-100 rounded w-20"></div>
                </div>
              </div>
            ))
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
               <p className="text-gray-500">No Jobs Found at the moment.</p>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="rounded-xl border-2 border-gray-200 bg-white p-6 transition-all hover:shadow-lg">
                  <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {job.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-gray-600">{job.company}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">New</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <span className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5">
                    📍 {job.location}
                  </span>
                  <span className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5">
                    💰 {job.salary_range}
                  </span>
                  <span className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5">
                    🕒 Full Time
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <span className="text-xs text-gray-400">
                    {new Date(job.posted_on).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                  <NavLink to={`/apply/${job.id}`} className="text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 transition">
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
          © 2026 <span className="font-semibold text-blue-700">JobPortal</span>.com | All rights reserved
        </p>
      </footer>
    </div>
  );
}
