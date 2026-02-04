import React, { useState, useEffect } from "react";
import { Menu, X, ArrowLeft, CheckCircle } from "lucide-react";
import { useActionState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";

export default function ApplyPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const username = localStorage.getItem("username") || "User"; 
  const userId = localStorage.getItem("userId");
  // 🔒 Page-level protection
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, []);

  // ✅ Action function FIRST
  async function applyAction(_, formData) {
    const token = localStorage.getItem("access");

    if (!token) {
      return { message: "Please login again", success: false };
    }

    const res = await fetch("http://127.0.0.1:8000/apply", {
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

 

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
     <header className="border-b bg-white sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          
          <div className="flex items-center gap-4">
            {/* Hamburger Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold text-blue-700">JobConnect</h1>
          </div>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-blue-700 transition-colors">Jobs</a>
            <a href="#" className="hover:text-blue-700 transition-colors">Companies</a>
            <a href="#" className="hover:text-blue-700 transition-colors">My Applications</a>
            <NavLink to={"/register"} className="hover:text-blue-700 transition " > Logout </NavLink>        
         </nav>

        <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-gray-600 font-medium">Hello,{username}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white shadow-sm">
              L
            </div>
          </div>
        </div>

        
        {isMenuOpen && (
          <nav className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-4 shadow-inner">
            <a href="#" className="text-sm font-semibold text-gray-700 py-2">Jobs</a>
            <a href="#" className="text-sm font-semibold text-gray-700 py-2">Companies</a>
            <a href="#" className="text-sm font-semibold text-gray-700 py-2 border-b pb-4">My Applications</a>
            <NavLink to={"/register"} className="block text-sm font-medium text-gray-700 hover:text-blue-700" > Logout </NavLink>         
       </nav>
        )}
      </header>

     <main className="flex-grow px-4 bg-gray-800">
        
   
        <div className="max-w-7xl mx-auto pt-6">
          <NavLink to={"/jobs"}> <button
            className="inline-flex items-center gap-2 mb-4 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={16} /> Back to Jobs
          </button>
         </NavLink>
        </div>

       
        <div className="flex items-center justify-center py-8 md:py-12">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="text-center sm:text-left">
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

                            
           { result && <p className={`text-center text-sm  ${result.success ? "text-green-600" : "text-red-600"}`}>
                                {result.message}
                            </p> }

            </form>
          </div>
        </div>
      </main>

     
      <footer className="border-t bg-gray-800 mt-auto">
        <div className="mx-auto bg-gray-800 max-w-7xl px-4 py-8 text-center text-sm text-white">
          © 2026 JobPortal.com • All rights reserved
        </div>
      </footer>
    </div>
  


)
}

