import { useCallback, useEffect, useState } from "react";
import { Building2, BriefcaseBusiness, LogOut, Plus, Search, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const experienceOptions = ["0-1", "1-3", "3-5", "5-8", "8+"];
const applicationStatuses = ["pending", "shortlisted", "rejected", "hired"];

function apiError(data) {
  if (data.message) return data.message;
  return Object.values(data).flat().join(" ");
}

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", description: "", experience: "", location: "", salary_range: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const company = localStorage.getItem("username") || "Employer";

  const loadDashboard = useCallback(async () => {
    const token = localStorage.getItem("access");
    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        fetch(`${API_URL}/employer/jobs`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/employer/applications?q=${encodeURIComponent(search)}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [jobsData, applicationsData] = await Promise.all([jobsResponse.json(), applicationsResponse.json()]);
      if (!jobsResponse.ok || !applicationsResponse.ok) throw new Error(apiError(!jobsResponse.ok ? jobsData : applicationsData));
      setJobs(jobsData);
      setApplications(applicationsData);
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Unable to load your employer dashboard.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(loadDashboard, 250);
    return () => clearTimeout(timer);
  }, [loadDashboard]);

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const createJob = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/employer/jobs`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}`, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(apiError(data));
      setForm({ title: "", description: "", experience: "", location: "", salary_range: "" });
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message || "Unable to publish this job.");
    } finally {
      setSaving(false);
    }
  };

  const setJobStatus = async (job) => {
    const nextStatus = job.status === "active" ? "closed" : "active";
    try {
      const response = await fetch(`${API_URL}/employer/jobs/${job.id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(apiError(data));
      setJobs((current) => current.map((item) => item.id === job.id ? { ...item, status: data.status } : item));
    } catch (requestError) {
      setError(requestError.message || "Unable to update job status.");
    }
  };

  const setApplicationStatus = async (applicationId, nextStatus) => {
    try {
      const response = await fetch(`${API_URL}/employer/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(apiError(data));
      setApplications((current) => current.map((application) => application.id === applicationId ? { ...application, status: data.status } : application));
    } catch (requestError) {
      setError(requestError.message || "Unable to update applicant status.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-blue-700"><Building2 size={22} /> JobConnect</NavLink>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium text-slate-600 sm:inline">Welcome, {company}</span>
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"><LogOut size={16} /> Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-9">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Employer workspace</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Hiring dashboard</h1>
            <p className="mt-2 text-slate-600">Manage job listings and find the right people for your team.</p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Job listings</p><p className="mt-1 flex items-center gap-2 text-xl font-black"><BriefcaseBusiness size={18} className="text-blue-700" />{jobs.length}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Applicants</p><p className="mt-1 flex items-center gap-2 text-xl font-black"><Users size={18} className="text-blue-700" />{applications.length}</p></div>
          </div>
        </div>

        {error && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        <section className="mb-9 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Plus size={21} /></span>
            <div><h2 className="text-xl font-black">Post a new job</h2><p className="text-sm text-slate-500">Published jobs appear in the job seeker listings.</p></div>
          </div>
          <form onSubmit={createJob} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">Job title *
              <input required maxLength={200} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Senior Product Designer" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="text-sm font-semibold text-slate-700">Location *
              <input required maxLength={100} value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="City, region, or remote" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="text-sm font-semibold text-slate-700">Experience *
              <select required value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                <option value="">Select experience</option>{experienceOptions.map((option) => <option key={option} value={option}>{option} years</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700">Salary range
              <input maxLength={50} value={form.salary_range} onChange={(event) => setForm({ ...form, salary_range: event.target.value })} placeholder="e.g. ₹12–18 LPA" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Job description *
              <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={4} placeholder="Describe the role, responsibilities, and what you are looking for..." className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <button type="submit" disabled={saving} className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800 disabled:opacity-60 sm:col-span-2 sm:justify-self-start">{saving ? "Publishing..." : "Publish job"}</button>
          </form>
        </section>

        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><h2 className="text-2xl font-black">Your jobs & applicants</h2><p className="mt-1 text-sm text-slate-500">Search applicants by name, mobile number, or email.</p></div>
            <label className="relative block w-full sm:max-w-sm">
              <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search candidates..." className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
          </div>
          {loading ? <p className="py-12 text-center text-slate-500">Loading your workspace...</p> : jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><BriefcaseBusiness size={28} className="mx-auto text-slate-400" /><p className="mt-3 font-bold">No job listings yet</p><p className="mt-1 text-sm text-slate-500">Publish your first role to start receiving applications.</p></div>
          ) : (
            <div className="space-y-5">
              {jobs.map((job) => {
                const jobApplications = applications.filter((application) => application.job_id === job.id);
                return (
                  <article key={job.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
                      <div><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-black">{job.title}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${job.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{job.status === "active" ? "Active" : "Closed"}</span></div><p className="mt-1 text-sm text-slate-500">{job.location} · {job.experience} years · {jobApplications.length} matching applicants</p></div>
                      <button type="button" onClick={() => setJobStatus(job)} className={`rounded-lg px-4 py-2 text-sm font-bold ${job.status === "active" ? "border border-slate-200 text-slate-700 hover:bg-slate-50" : "bg-blue-700 text-white hover:bg-blue-800"}`}>{job.status === "active" ? "Close listing" : "Reopen listing"}</button>
                    </div>
                    {jobApplications.length ? (
                      <div className="divide-y divide-slate-100">
                        {jobApplications.map((application) => (
                          <div key={application.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:px-6">
                            <div><p className="font-bold">{application.name}</p><p className="mt-0.5 text-sm text-slate-500">{application.email}</p></div>
                            <div><p className="text-sm font-medium text-slate-700">{application.mobile || "Mobile not provided"}</p><p className="mt-0.5 text-xs text-slate-400">Applied {new Date(application.applied_on).toLocaleDateString()}</p></div>
                            <select aria-label={`Application status for ${application.name}`} value={application.status} onChange={(event) => setApplicationStatus(application.id, event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold capitalize text-slate-700 outline-none focus:border-blue-500">
                              {applicationStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    ) : <p className="px-6 py-5 text-sm text-slate-500">{search ? "No applicants match this search." : "No applications received yet."}</p>}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
