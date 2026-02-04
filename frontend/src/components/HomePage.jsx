import { useState } from "react";
import { Menu, X, Briefcase, MapPin, Building2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import Loader from "./Loader";
export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false);
  }, 1500); // 1.5 seconds (smooth UX)

  return () => clearTimeout(timer);
}, []);

if (loading) {
  return <Loader />;
}

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700">JobConnect</h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 font-medium text-sm">
            <NavLink to="/job" className="hover:text-blue-700">Jobs</NavLink>
            <NavLink to="/company" className="hover:text-blue-700">Companies</NavLink>
            <NavLink to="/login" className="hover:text-blue-700">Login</NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 md:hidden">
            <div className="absolute right-0 top-0 h-full w-64 bg-white p-6 shadow-xl">
              <button
                onClick={() => setMenuOpen(false)}
                className="mb-6"
              >
                <X />
              </button>

              <nav className="flex flex-col gap-4 font-medium">
                <NavLink to="/job" onClick={() => setMenuOpen(false)}>Jobs</NavLink>
                <NavLink to="/company" onClick={() => setMenuOpen(false)}>Companies</NavLink>
                <NavLink to="/login" onClick={() => setMenuOpen(false)}>Login</NavLink>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Find Your Dream Job Today
          </h2>
          <p className="mt-4 text-blue-100 max-w-2xl mx-auto text-sm sm:text-base">
            Browse thousands of jobs from top companies across India
          </p>

          {/* SEARCH BAR */}
          <div className="mt-8 bg-white rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Briefcase size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Job title or keyword"
                className="w-full outline-none text-gray-700"
              />
            </div>

            <div className="flex items-center gap-2 flex-1">
              <MapPin size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                className="w-full outline-none text-gray-700"
              />
            </div>

            <NavLink
              to="/register"
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition text-center"
            >
              Search
            </NavLink>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h3 className="text-xl sm:text-2xl font-bold text-center">
          Popular Categories
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10">
          {["Frontend", "Backend", "UI/UX", "Mobile", "DevOps", "Data", "Marketing", "Product"].map(cat => (
            <div
              key={cat}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition"
            >
              <Building2 className="mx-auto text-blue-700" />
              <p className="mt-3 font-semibold">{cat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="bg-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-xl sm:text-2xl font-bold text-center">
            Latest Jobs
          </h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
            {[1, 2, 3, 4, 5, 6].map(job => (
              <div
                key={job}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <h4 className="font-bold text-lg">Software Engineer</h4>
                <p className="text-sm text-gray-500">TechHive • Remote</p>
                <p className="mt-3 font-semibold">₹5 – 9 LPA</p>

                <NavLink
                  to="/login"
                  className="inline-block mt-4 text-blue-700 font-semibold hover:underline"
                >
                  View Details →
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm">
          © 2026 JobPortal • All rights reserved
        </div>
      </footer>
    </div>
  );
}
