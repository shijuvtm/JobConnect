import { MapPin, Briefcase, IndianRupee, Clock, ArrowRight, Menu, X } from "lucide-react"; // Added missing imports
import { NavLink } from "react-router-dom";
import { useState } from "react";

const jobs = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Software Engineer ${i + 1}`,
  company: ["SuperNova", "CodeCraft", "PixelWorks", "NextGen", "TechHive"][i % 5],
  location: ["Chennai", "Bangalore", "Hyderabad", "Pune", "Remote"][i % 5],
  salary: "₹4 – 10 LPA",
  type: ["Full Time", "Remote", "Hybrid"][i % 3],
  posted: "2 days ago",
}));

export default function JobPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
          {/* HEADER */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-700">
                       <NavLink to="/"> JobConnect</NavLink>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
                        <NavLink to="/job" className="hover:text-blue-700">Jobs</NavLink>
                        <NavLink to="/company" className="hover:text-blue-700">Companies</NavLink>
                        <NavLink to="/services" className="hover:text-blue-700">Services</NavLink>
                        <NavLink to="/login" className="hover:text-blue-700 font-bold">Login</NavLink>
                    </nav>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-md focus:bg-gray-100 outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t px-6 py-4 space-y-4 shadow-lg">
                        <NavLink to="/job" className="block text-gray-700 hover:text-blue-700">Jobs</NavLink>
                        <NavLink to="/company" className="block text-gray-700 hover:text-blue-700">Companies</NavLink>
                        <NavLink to="/services" className="block text-gray-700 hover:text-blue-700">Services</NavLink>
                        <NavLink to="/Login" className="block text-blue-700 font-bold">Login</NavLink>
                    </div>
                )}
            </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Latest Openings
            </h1>
            <p className="text-slate-500 mt-1">Find your next challenge among {jobs.length} curated roles.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium shadow-sm cursor-default">
              ✨ Newest First
            </span>
          </div>
        </div>

        {/* Job Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="group relative flex flex-col bg-white rounded-[32px] border border-slate-100 p-1.5 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-100 transition-all duration-300"
            >
              <div className="p-7">
                {/* Top Section: Role & Time */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <Clock size={12} /> {job.posted}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                    job.type === 'Remote' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {job.type}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-300 leading-snug">
                  {job.title}
                </h2>
                <p className="text-slate-400 font-semibold mt-1.5">{job.company}</p>

                {/* Details */}
                <div className="mt-8 flex flex-wrap gap-5 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500/50" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-blue-500/50" />
                    {job.type}
                  </div>
                </div>
              </div>

              {/* Bottom "Action" Bar */}
              <div className="mt-auto bg-slate-50/60 backdrop-blur-sm rounded-b-[28px] p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Estimated Salary</p>
                  <p className="text-slate-900 font-extrabold text-lg">
                    {job.salary}
                  </p>
                </div>

                <NavLink
                  to="/register"
                  className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                >
                  <ArrowRight size={22} />
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
