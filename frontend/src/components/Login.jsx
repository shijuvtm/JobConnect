import { useEffect, useState } from "react";
import { useActionState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, UserRound } from "lucide-react";
import { API_URL } from "../config";

async function loginAction(_, formData) {
  try {
    const payload = Object.fromEntries(formData);
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) return data.message || data.detail || "Unable to sign in";

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("username", data.user.username);
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("role", data.user.role);
    return `Login successful:${data.user.role}`;
  } catch {
    return "Login failed: Server unreachable";
  }
}

export default function Login() {
  const location = useLocation();
  const [role, setRole] = useState(location.state?.role || "job_seeker");
  const [message, formAction, isPending] = useActionState(loginAction, "");
  const navigate = useNavigate();

  useEffect(() => {
    if (message.startsWith("Login successful:")) {
      navigate(message.endsWith(":employer") ? "/employer/dashboard" : "/jobs", { replace: true });
    }
  }, [message, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <NavLink to="/" className="text-xl font-black tracking-tight text-blue-700">JobConnect</NavLink>
          <NavLink to="/register" className="text-sm font-semibold text-slate-600 hover:text-blue-700">Create an account</NavLink>
        </div>
      </header>
      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-12 px-6 py-12 md:grid-cols-2">
        <section className="hidden md:block">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-700">Your next chapter starts here</p>
          <h1 className="max-w-lg text-5xl font-black leading-tight tracking-tight">Good people. Great work. Better futures.</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">Sign in to find your next opportunity or build the team that will take your business further.</p>
          <div className="mt-8 flex gap-3 text-sm font-semibold text-slate-700">
            <span className="rounded-full bg-blue-50 px-4 py-2 text-blue-700">Curated opportunities</span>
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-emerald-700">Simple hiring</span>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">
          <p className="text-sm font-semibold text-blue-700">Welcome back</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">Sign in to JobConnect</h2>
          <p className="mt-2 text-sm text-slate-500">Choose your account type to continue.</p>

          <div className="mt-7 grid grid-cols-2 gap-3" role="group" aria-label="Account type">
            {[
              { value: "job_seeker", label: "Job seeker" },
              { value: "employer", label: "Employer" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value)}
                aria-pressed={role === option.value}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition ${
                  role === option.value ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {option.value === "employer" ? <BriefcaseBusiness size={17} /> : <UserRound size={17} />} {option.label}
              </button>
            ))}
          </div>

          <form action={formAction} className="mt-6 space-y-4">
            <input type="hidden" name="role" value={role} />
            <label className="block text-sm font-semibold text-slate-700">
              Email address
              <input name="email" type="email" autoComplete="email" required placeholder="you@company.com" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input name="password" type="password" autoComplete="current-password" required placeholder="Enter your password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <div className="text-right">
              <NavLink to="/forgot-password" className="text-sm font-semibold text-blue-700 hover:underline">Forgot password?</NavLink>
            </div>
            <button disabled={isPending} type="submit" className="w-full rounded-xl bg-blue-700 py-3.5 font-bold text-white transition hover:bg-blue-800 disabled:opacity-60">
              {isPending ? "Signing in..." : `Continue as ${role === "employer" ? "employer" : "job seeker"}`}
            </button>
            {message && !message.startsWith("Login successful:") && <p role="alert" className="rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-700">{message}</p>}
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to JobConnect? <NavLink to={role === "employer" ? "/register/employer" : "/register"} className="font-bold text-blue-700 hover:underline">Create a {role === "employer" ? "employer" : "job seeker"} account</NavLink>
          </p>
          <p className="mt-3 text-center text-xs text-slate-500">
            {role === "employer" ? "Looking for work?" : "Hiring a team?"}{" "}
            <button type="button" onClick={() => setRole(role === "employer" ? "job_seeker" : "employer")} className="font-semibold text-blue-700 hover:underline">Switch account type</button>
          </p>
        </section>
      </main>
    </div>
  );
}
