import React from 'react'
import {useState} from 'react';
import { useActionState } from "react";
import { NavLink } from "react-router-dom";
async function registerAction(_,formData){
   const json=Object.fromEntries(formData);
   const res=await fetch('http://127.0.0.1:8000/register',{
       method: "POST",
       headers:{
         "Content-Type":"application/json"
       },
       body:JSON.stringify(json)
});
   const data=await res.json();
    return data.message || "Registration failed"
};
 
export default function Register(){
 const [isMenuOpen,setIsMenuOpen]=useState(false);
 const[message,formAction,isPending]=useActionState(registerAction,"",{
  withPending:true
})
return(
 <div className="bg-gray-50 text-gray-800 min-h-screen font-sans">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-700">
            JobConnect
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-blue-700 transition">Jobs</a>
            <a href="#" className="hover:text-blue-700 transition">Companies</a>
            <a href="#" className="hover:text-blue-700 transition">Services</a>
            <NavLink to={"/login"} className="hover:text-blue-700 transition">Login</NavLink>
          </nav>

          {/* Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="outline-none p-2 rounded-md hover:bg-gray-100 transition"
            >
              <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t px-6 py-4 space-y-4 shadow-xl animate-in slide-in-from-top duration-300">
            <a href="#" className="block text-gray-700 hover:text-blue-700 font-medium">Jobs</a>
            <a href="#" className="block text-gray-700 hover:text-blue-700 font-medium">Companies</a>
            <a href="#" className="block text-gray-700 hover:text-blue-700 font-medium">Services</a>
            <div className="border-t pt-4">
              <a href="#" className="block text-center bg-blue-700 text-white py-2 rounded-md font-bold">Login</a>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Marketing Info */}
        <section className="text-center md:text-left order-2 md:order-1">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900">
            Find your dream <br className="hidden md:block" /> job now
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-md mx-auto md:mx-0">
            Register with JobPortal and get matched with the right opportunities. 
            Apply to top companies with one click.
          </p>

          <div className="mt-8 space-y-4 inline-block text-left">
            {[
              "Trusted by 5000+ recruiters",
              "Personalized job recommendations",
              "Priority profile visibility"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-700">
                <div className="bg-green-100 p-1 rounded-full">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Right Side: Registration Form */}
        <section className="order-1 md:order-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-xl max-w-md w-full mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">Create profile</h2>
            <p className="text-gray-500 mt-2 mb-8">Join the largest talent network in India.</p>

            <form action={formAction} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Username</label>
                <input name='username' type="text" placeholder="Enter Name" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-200 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Email Address</label>
                <input type="email" name='email' placeholder="john@example.com" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-200 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Password</label>
                <input type="password" name='password' placeholder=" Minimum 6 character" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-200 outline-none" />
              </div>

              <button disabled={isPending} type='submit' className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-200 active:scale-[0.98]">
               {isPending ? 'Registering..':'Register Now' }
              </button>
              <p className="text-center text-sm text-gray-600">{message}</p>
              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                By clicking Register, you agree to our 
                <a href="#" className="text-blue-600 underline ml-1">Terms</a> & <a href="#" className="text-blue-600 underline">Privacy Policy</a>
              </p>
              <p class="text-sm text-center text-gray-600">
                    Already registered?
                    <NavLink to={"/login"} class="text-blue-700 font-medium hover:underline">
                        Login here
                    </NavLink>
                </p>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          © 2026 JobPortal. All rights reserved.
        </div>
      </footer>

      {/* Basic Tailwind CSS "input-style" shortcut (add to your global CSS or use raw classes) */}
      <style jsx>{`
        .input-style {
          @apply w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all;
        }
      `}</style>
    </div>



)
}

