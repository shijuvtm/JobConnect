import { Building2, MapPin, ArrowUpRight, Menu, X } from "lucide-react"; // Added Menu and X
import { NavLink } from "react-router-dom";
import { useState } from "react";

const companies = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: ["SuperNova", "CodeCraft", "PixelWorks", "NextGen", "TechHive"][i % 5],
  industry: ["Product", "Service", "Startup", "AI", "FinTech", "EdTech"][i % 6],
  location: ["Chennai", "Bangalore", "Hyderabad", "Pune", "Delhi", "Remote"][i % 6],
}));

export default function CompanyPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header - Moved outside for full-width sticky effect */}
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
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Featured Companies
            </h1>
            <p className="text-slate-500 mt-4 text-lg max-w-2xl">
              Discover your next career move at world-class workplaces with inclusive cultures and innovative missions.
            </p>
          </div>
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest">
            {companies.length} Total Partners
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {companies.map((company) => (
            <NavLink
              key={company.id}
              to="/login" 
              className="group relative flex flex-col bg-white rounded-3xl p-7 border border-slate-200 hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]"
            >
              {/* Decorative background blur on hover */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="w-14 h-14 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-600 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300">
                  <Building2 size={28} />
                </div>
                <div className="p-2 rounded-full bg-slate-50 text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              <div className="mb-6 relative z-10">
                <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                  {company.title}
                </h2>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-tighter rounded-md group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-300">
                  {company.industry}
                </span>
              </div>

              <div className="mt-auto pt-5 border-t border-slate-100 flex items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors duration-300">
                <MapPin size={16} className="text-blue-500/60" />
                <span className="text-sm font-semibold">{company.location}</span>
              </div>
            </NavLink>
          ))}
        </div>
      </main>
    </div>
  );
}
