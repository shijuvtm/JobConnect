import React, { useState, useEffect } from "react";
import { Menu, X, ArrowLeft, MapPin, Wallet, GraduationCap } from "lucide-react";
import { useActionState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { API_URL } from '../config';

const EXPERIENCE_LABELS = {
  "0-1": "0-1 years (Fresher)",
  "1-3": "1-3 years (Junior)",
  "3-5": "3-5 years (Mid-level)",
  "5-8": "5-8 years (Senior)",
  "8+": "8+ years (Lead)",
};

export default function ApplyPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const username = localStorage.getItem("username") || "User"; 
  const userId = localStorage.getItem("userId");

  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobError, setJobError] = useState("");

  // 🔒 Page-level protection
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, []);

  // 📄 Load job details (from the existing /jobs list)
  useEffect(() => {
    const token = localStorage.getItem("access");
    let cancelled = false;

    async function loadJob() {
      try {
        const res = await fetch(`${API_URL}/jobs`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to load jobs");

        const jobs = await res.json();
        const found = jobs.find((j) => String(j.id) === String(jobId));

        if (!cancelled) {
          if (found) setJob(found);
          else setJobError("This job is no longer available.");
        }
      } catch {
        if (!cancelled) setJobError("Could not load job details.");
      } finally {
        if (!cancelled) setJobLoading(false);
      }
    }

    loadJob();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  // ✅ Action function FIRST
  async function applyAction(_, formData) {
    const token = localStorage.getItem("access");

    if (!token) {
      return { message: "Please login again", success: false };
    }

    const res = await fetch(`${API_URL}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        job: jobId,
        applicant: userId,
      }),
    });

    // 🔐 Token expired / invalid
    if (res.status === 401) {
      localStorage.clear();
      navigate("/login", { replace: true });
      return {
        message: "Session expired. Please login again.",
        success: false,
      };
    }

    const data = await res.json();

    if (res.ok) {
      return { message: data.message, success: true };
    }

    return { message: data.message || "Failed to apply", success: false };
  }

  // ✅ useActionState AFTER function
  const [result, formAction, isPending] = useActionState(
    applyAction,
    { message: "", success: false },
    { withPending: true }
  );

  // ⏳ Show loader until job data is ready, so the component doesn't flash
  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />
          <p className="text-sm text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold text-blue-700">JobConnect</h1>
          </div>

          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
            <NavLink to="/jobs" className="hover:text-blue-700 transition-colors">Jobs</NavLink>
            <NavLink to="/services" className="hover:text-blue-700 transition-colors">AI Services</NavLink>
            <NavLink to="/application" className="hover:text-blue-700 transition-colors">My Applications</NavLink>
            <NavLink to={"/register"} className="hover:text-blue-700 transition">Logout</NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-gray-600 font-medium">Hello, {username}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white shadow-sm">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-4 shadow-inner">
            <NavLink to="/jobs" className="text-sm font-semibold text-gray-700 py-2">Jobs</NavLink>
            <NavLink to="/services" className="text-sm font-semibold text-gray-700 py-2">AI Services</NavLink>
            <NavLink to="/application" className="text-sm font-semibold text-gray-700 py-2 border-b pb-4">My Applications</NavLink>
            <NavLink to={"/register"} className="block text-sm font-medium text-gray-700 hover:text-blue-700">Logout</NavLink>
          </nav>
        )}
      </header>

      <main className="flex-grow px-4 py-6 md:py-10">
        <div className="max-w-5xl mx-auto">
          <NavLink
            to={"/jobs"}
            className="inline-flex items-center gap-2 mb-4 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={16} /> Back to Jobs
          </NavLink>

          {jobError && !job ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <p className="text-sm text-red-600">{jobError}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-5">
              {/* Job details */}
              <section className="md:col-span-3 rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 break-words">
                  {job.title}
                </h2>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-blue-700" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-800 break-words">
                        {job.location || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                    <GraduationCap size={18} className="mt-0.5 shrink-0 text-blue-700" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Experience</p>
                      <p className="text-sm font-medium text-gray-800 break-words">
                        {EXPERIENCE_LABELS[job.experience] || job.experience || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                    <Wallet size={18} className="mt-0.5 shrink-0 text-blue-700" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Salary</p>
                      <p className="text-sm font-medium text-gray-800 break-words">
                        {job.salary_range || "Not disclosed"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Job Description
                  </h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                    {job.description}
                  </p>
                </div>
              </section>

              {/* Apply card */}
              <section className="md:col-span-2 h-fit rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm md:sticky md:top-24">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-bold text-gray-900">Apply for this job</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Your profile and resume will be shared directly with the hiring team.
                  </p>
                </div>

                <form action={formAction} className="mt-8 space-y-6">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-700 py-3.5 px-4 text-base font-bold text-white shadow-lg hover:bg-blue-800 active:scale-[0.98] transition-all focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >
                    {isPending ? "Applying" : "Apply Now"}
                  </button>

                  {result && (
                    <p className={`text-center text-sm ${result.success ? "text-green-600" : "text-red-600"}`}>
                      {result.message}
                    </p>
                  )}
                </form>
              </section>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t bg-gray-800 mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-white">
          © 2026 JobPortal.com • All rights reserved
        </div>
      </footer>
    </div>
  );
}
