import { useState } from "react";
import { Building2, BriefcaseBusiness, Loader2 } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const initialForm = {
  full_name: "",
  email: "",
  mobile: "",
  password: "",
  company_name: "",
  company_email: "",
  designation: "",
  website: "",
};

function getErrorMessage(data) {
  if (data.message) return data.message;
  return Object.entries(data)
    .map(([field, messages]) => `${field.replaceAll("_", " ")}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
    .join(" ");
}

export default function EmployerRegister() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/employer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(getErrorMessage(data));
        return;
      }
      navigate("/login", { state: { role: "employer" } });
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <NavLink to="/" className="text-xl font-black text-blue-700">JobConnect</NavLink>
          <NavLink to="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-700">Already registered? Sign in</NavLink>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700"><Building2 size={26} /></span>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">For growing teams</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Create your employer account</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">Set up your company profile, post a role, and connect with qualified candidates.</p>
        </div>
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-9">
          <h2 className="mb-5 flex items-center gap-2 font-bold"><BriefcaseBusiness size={19} className="text-blue-700" /> Contact details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">Your full name *
              <input name="full_name" value={form.full_name} onChange={updateField} required maxLength={150} autoComplete="name" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="text-sm font-semibold text-slate-700">Work email *
              <input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="text-sm font-semibold text-slate-700">Mobile number *
              <input name="mobile" type="tel" value={form.mobile} onChange={updateField} required minLength={10} maxLength={15} autoComplete="tel" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="text-sm font-semibold text-slate-700">Password *
              <input name="password" type="password" value={form.password} onChange={updateField} required minLength={8} autoComplete="new-password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
          </div>

          <h2 className="mb-5 mt-8 border-t border-slate-100 pt-6 font-bold">Company profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">Company name *
              <input name="company_name" value={form.company_name} onChange={updateField} required maxLength={200} autoComplete="organization" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="text-sm font-semibold text-slate-700">Company email
              <input name="company_email" type="email" value={form.company_email} onChange={updateField} autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="text-sm font-semibold text-slate-700">Your title
              <input name="designation" value={form.designation} onChange={updateField} maxLength={150} placeholder="e.g. Talent Partner" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="text-sm font-semibold text-slate-700">Company website
              <input name="website" type="url" value={form.website} onChange={updateField} placeholder="https://" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
          </div>
          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 font-bold text-white transition hover:bg-blue-800 disabled:opacity-60">
            {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : "Create employer account"}
          </button>
          <p className="mt-5 text-center text-sm text-slate-500">Looking for work instead? <NavLink to="/register" className="font-semibold text-blue-700 hover:underline">Register as a job seeker</NavLink></p>
        </form>
      </main>
    </div>
  );
}
