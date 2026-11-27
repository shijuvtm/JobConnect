import { useEffect, useState } from "react";
import { ArrowRight, BriefcaseBusiness, Building2, MapPin, Search, Sparkles, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const categories = ["Engineering", "Design", "Product", "Marketing", "Data & Analytics", "Customer success"];

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [loadError, setLoadError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/jobs`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load the latest jobs.");
        return response.json();
      })
      .then((data) => { if (active) setJobs(data.slice(0, 3)); })
      .catch((error) => { if (active) setLoadError(error.message); });
    return () => { active = false; };
  }, []);

  const searchJobs = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("search", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    navigate(`/jobs${params.size ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-blue-700"><BriefcaseBusiness size={22} /> JobConnect</NavLink>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <a href="#jobs" className="transition hover:text-blue-700">Find a job</a>
            <a href="#how-it-works" className="transition hover:text-blue-700">How it works</a>
            <NavLink to="/register/employer" className="transition hover:text-blue-700">For employers</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <NavLink to="/login" className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100">Sign in</NavLink>
            <NavLink to="/register" className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800">Get started</NavLink>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="absolute -bottom-48 left-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-200"><Sparkles size={14} /> A better way to work</span>
              <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl">Your next opportunity is closer than you think.</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Discover roles that match your ambition, connect with teams that value your skills, and make your next move count.</p>

              <form onSubmit={searchJobs} className="mt-9 grid gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/20 sm:grid-cols-[1fr_0.8fr_auto]">
                <label className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-400">
                  <Search size={19} />
                  <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Job title or keyword" aria-label="Job title or keyword" className="min-w-0 flex-1 text-sm text-slate-800 outline-none placeholder:text-slate-400" />
                </label>
                <label className="flex items-center gap-3 rounded-xl border-t border-slate-100 px-3 py-2 text-slate-400 sm:border-l sm:border-t-0">
                  <MapPin size={19} />
                  <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City or remote" aria-label="Location" className="min-w-0 flex-1 text-sm text-slate-800 outline-none placeholder:text-slate-400" />
                </label>
                <button type="submit" className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800">Search jobs</button>
              </form>

              <p className="mt-4 text-sm text-slate-400">Popular: <span className="text-slate-200">Software Engineer · Product Designer · Data Analyst</span></p>
            </div>

            <div className="hidden lg:block">
              <div className="relative mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div><p className="text-sm font-bold">A fresh start</p><p className="mt-1 text-xs text-slate-400">The right role changes everything.</p></div>
                  <span className="rounded-xl bg-blue-500/20 p-3 text-blue-200"><BriefcaseBusiness size={21} /></span>
                </div>
                <div className="mt-5 space-y-3">
                  {["Find work that fits", "Meet your future team", "Grow on your own terms"].map((item, index) => (
                    <div key={item} className="flex items-center gap-4 rounded-xl bg-white/[0.06] p-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-sm font-black text-blue-200">0{index + 1}</span>
                      <span className="text-sm font-semibold text-slate-200">{item}</span>
                      <ArrowRight size={16} className="ml-auto text-slate-500" />
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-3 rounded-xl bg-emerald-400/10 p-4 text-sm text-emerald-100"><Users size={18} /> Built for candidates and hiring teams alike</div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Explore opportunities</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Find your place to thrive</h2></div>
            <NavLink to="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:gap-3">Browse all jobs <ArrowRight size={17} /></NavLink>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => <NavLink key={category} to={`/jobs?search=${encodeURIComponent(category)}`} className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 font-semibold transition hover:border-blue-300 hover:bg-blue-50/50"><span>{category}</span><ArrowRight size={17} className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" /></NavLink>)}
          </div>
        </section>

        <section id="jobs" className="bg-slate-50 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Freshly posted</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Latest opportunities</h2></div>
              <NavLink to="/jobs" className="text-sm font-bold text-blue-700 hover:underline">See all open roles <span aria-hidden="true">→</span></NavLink>
            </div>
            {loadError ? <p role="status" className="mt-8 rounded-xl bg-white p-5 text-sm text-slate-600">{loadError} <NavLink to="/jobs" className="font-semibold text-blue-700">Browse jobs</NavLink></p> : jobs.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">New opportunities will show up here soon. <NavLink to="/jobs" className="font-semibold text-blue-700">Browse jobs</NavLink></div>
            ) : (
              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                {jobs.map((job) => (
                  <article key={job.id} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-start justify-between gap-3"><span className="rounded-xl bg-blue-50 p-3 text-blue-700"><Building2 size={20} /></span><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Open</span></div>
                    <h3 className="mt-5 text-lg font-black">{job.title}</h3>
                    <p className="mt-1 font-semibold text-slate-600">{job.company}</p>
                    <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500"><span className="flex items-center gap-1"><MapPin size={15} />{job.location}</span><span>{job.experience} years</span></div>
                    {job.salary_range && <p className="mt-3 text-sm font-bold text-slate-800">{job.salary_range}</p>}
                    <NavLink to="/jobs" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:gap-3">View opportunity <ArrowRight size={16} /></NavLink>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="grid gap-4 rounded-3xl bg-blue-700 p-7 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
            <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-200">Building a team?</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">Meet the people who will move you forward.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">Create your employer account, publish a role, and keep every application organized in one place.</p></div>
            <NavLink to="/register/employer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-blue-700 transition hover:bg-blue-50">Hire with JobConnect <ArrowRight size={17} /></NavLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <NavLink to="/" className="font-black text-blue-700">JobConnect</NavLink>
          <p>Connecting people with work worth doing.</p>
          <NavLink to="/register/employer" className="font-semibold hover:text-blue-700">For employers</NavLink>
        </div>
      </footer>
    </div>
  );
}
