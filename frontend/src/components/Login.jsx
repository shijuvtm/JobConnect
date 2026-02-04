import React, { useState , useEffect} from 'react';
import { useActionState } from 'react';
import { NavLink,useNavigate } from "react-router-dom";

async function loginAction(prevState, formData) {
  try {
    const json = Object.fromEntries(formData);

    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });

    const data = await res.json();

    if (!res.ok) {
      return data.message || data.detail || "Invalid credentials";
    }

    // Clear old tokens (safe)
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    // Store JWT tokens
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("username", data.user.username);

    return "Login successful";
  } catch (error) {
    return "Login failed: Server unreachable";
  }
}


export default function Login() {
    // React State for Mobile Menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // React 19 useActionState Hook
    const [message, formAction, isPending] = useActionState(loginAction, "");
    const navigate = useNavigate();
    
    useEffect(() => {
      if (message === "Login successful") { 
       navigate("/jobs",{replace:true});
     }
    }, [message]);

    return (
        <div className="bg-gray-50 text-gray-800 min-h-screen">
            {/* HEADER */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-700">
                        JobConnect
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
                        <a href="#" className="hover:text-blue-700">Jobs</a>
                        <a href="#" className="hover:text-blue-700">Companies</a>
                        <a href="#" className="hover:text-blue-700">Services</a>
                        <a href="#" className="hover:text-blue-700 font-bold">Register</a>
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
                        <a href="#" className="block text-gray-700 hover:text-blue-700">Jobs</a>
                        <a href="#" className="block text-gray-700 hover:text-blue-700">Companies</a>
                        <a href="#" className="block text-gray-700 hover:text-blue-700">Services</a>
                        <a href="#" className="block text-blue-700 font-bold">Register</a>
                    </div>
                )}
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                
                {/* Left Side: Marketing Info (Hidden on small mobile if you prefer, but visible here) */}
                <section className="hidden md:block">
                    <h1 className="text-4xl font-bold leading-tight">
                        Find your dream <br /> job now
                    </h1>
                    <p className="mt-4 text-gray-600 max-w-md text-lg">
                        Register with JobPortal and get matched with the right opportunities.
                        Build your profile and apply to jobs in top companies.
                    </p>
                    <ul className="mt-8 space-y-3 text-sm text-gray-700">
                        <li className="flex items-center gap-2">✔ Trusted by thousands of recruiters</li>
                        <li className="flex items-center gap-2">✔ Personalized job recommendations</li>
                        <li className="flex items-center gap-2">✔ Easy apply & profile visibility</li>
                    </ul>
                </section>

                {/* Login Form Section */}
                <section className="bg-white border rounded-xl p-8 shadow-sm max-w-md w-full mx-auto">
                    <h2 className="text-2xl font-bold text-blue-700 text-center">
                        JobPortal
                    </h2>
                    <p className="text-sm text-gray-500 text-center mt-1">
                        Login to your account
                    </p>

                    <form action={formAction} className="mt-8 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input 
                                type="text" 
                                name="username" 
                                required
                                placeholder="Username" 
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-200 outline-none transition" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input 
                                type="password" 
                                name="password" 
                                required
                                placeholder="Enter your password" 
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-200 outline-none transition" 
                            />
                        </div>

                        <div className="text-right">
                            <a href="#" className="text-sm text-blue-700 hover:underline">
                                Forgot Password?
                            </a>
                        </div>

                        <button 
                            disabled={isPending} 
                            type='submit' 
                            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-semibold py-3 rounded-md transition-all active:scale-[0.98]"
                        >
                            {isPending ? 'Logging in...' : 'Login'}
                        </button>

                        {message && (
                            <p className={`text-center text-sm font-medium p-2 rounded ${message.includes('failed') ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                                {message}
                            </p>
                        )}

                        <p className="text-sm text-center text-gray-600">
                            New to JobPortal?
                            <NavLink to={"/register"} className="text-blue-700 font-bold hover:underline ml-1">
                                Register here
                            </NavLink>
                        </p>
                    </form>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="border-t bg-white py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-6 text-sm text-gray-500 text-center">
                    © 2026 JobPortal.com | All rights reserved
                </div>
            </footer>
        </div>
    );
}
