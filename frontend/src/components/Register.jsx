import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/registerSchema";
import {
  UserRoundPen,
  BriefcaseBusiness,
  GraduationCap,
  Menu,
  X,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  CloudUpload,
  Loader2
} from "lucide-react";
import { API_URL } from '../config';

export default function Register() {
  const [step, setStep] = useState(1);
  const [showPwd, setShowPwd] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const nextStep = async () => {
    let fields = [];
    if (step === 1) fields = ["full_name", "phone", "email", "password", "confirmPassword"];
    if (step === 2) fields = ["degree", "university", "graduation_year"];
    
    const isValid = await trigger(fields);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();

    // Append text fields and the file
    Object.keys(data).forEach((key) => {
      if (key === "resume") {
        formData.append("resume", data.resume[0]);
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Registration successful 🎉");
        navigate("/login");
      } else {
        const result = await res.json();
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold text-blue-700 tracking-tight">JobConnect</NavLink>
          <nav className="hidden md:flex gap-8 font-semibold text-sm text-slate-600">
            <NavLink to="/job" className="hover:text-blue-700">Jobs</NavLink>
            <NavLink to="/login" className="px-5 py-2 bg-blue-50 text-blue-700 rounded-full">Login</NavLink>
          </nav>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        {/* Progress Indicator */}
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${step >= s ? "bg-blue-600 text-white" : "bg-white text-slate-400 border"}`}>
                {s}
              </div>
            ))}
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-8 md:p-10 rounded-[40px] shadow-xl border border-slate-100 relative">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-3xl mb-4"><UserRoundPen size={32} /></div>
                <h2 className="text-2xl font-black">Create Account</h2>
              </div>
              <input {...register("full_name")} placeholder="Full Name" className="form-input-premium" />
              {errors.full_name && <p className="error-msg">{errors.full_name.message}</p>}
              
              <input {...register("phone")} placeholder="Mobile Number" className="form-input-premium" />
              {errors.phone && <p className="error-msg">{errors.phone.message}</p>}
              
              <input {...register("email")} placeholder="Email Address" className="form-input-premium" />
              {errors.email && <p className="error-msg">{errors.email.message}</p>}
              
              <div className="relative">
                <input type={showPwd ? "text" : "password"} {...register("password")} placeholder="Password" className="form-input-premium" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-4 text-slate-400">
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="error-msg">{errors.password.message}</p>}
              
              <input type="password" {...register("confirmPassword")} placeholder="Confirm Password" className="form-input-premium" />
              {errors.confirmPassword && <p className="error-msg">{errors.confirmPassword.message}</p>}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-3xl mb-4"><GraduationCap size={32} /></div>
                <h2 className="text-2xl font-black">Education</h2>
              </div>
              <input {...register("degree")} placeholder="Highest Degree" className="form-input-premium" />
              {errors.degree && <p className="error-msg">{errors.degree.message}</p>}
              
              <input {...register("university")} placeholder="University Name" className="form-input-premium" />
              {errors.university && <p className="error-msg">{errors.university.message}</p>}
              
              <input type="number" {...register("graduation_year", { valueAsNumber: true })} placeholder="Graduation Year" className="form-input-premium" />
              {errors.graduation_year && <p className="error-msg">{errors.graduation_year.message}</p>}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-3xl mb-4"><BriefcaseBusiness size={32} /></div>
                <h2 className="text-2xl font-black">Preferences</h2>
              </div>
              <select {...register("work_type")} className="form-input-premium">
                <option value="">Work Type</option>
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              {errors.work_type && <p className="error-msg">{errors.work_type.message}</p>}

              <input type="number" {...register("expected_salary", { valueAsNumber: true })} placeholder="Expected Salary (LPA)" className="form-input-premium" />
              {errors.expected_salary && <p className="error-msg">{errors.expected_salary.message}</p>}

              <textarea {...register("skills")} placeholder="Skills (React, Node...)" className="form-input-premium min-h-[100px]" />
              {errors.skills && <p className="error-msg">{errors.skills.message}</p>}

              <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center ${errors.resume ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}>
                <input type="file" accept=".pdf" {...register("resume")} className="absolute inset-0 opacity-0 cursor-pointer" />
                <CloudUpload className="mx-auto text-slate-400 mb-2" size={24} />
                <p className="text-xs font-bold text-slate-600">{watch("resume")?.[0]?.name || "Upload PDF Resume"}</p>
              </div>
              {errors.resume && <p className="error-msg text-center">{errors.resume.message}</p>}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-10">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="flex-1 py-4 rounded-2xl font-bold bg-slate-50 text-slate-600">Back</button>
            )}
            {step < 3 ? (
              <button type="button" onClick={nextStep} className="flex-1 py-4 rounded-2xl font-bold bg-blue-600 text-white">Next Step</button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="flex-1 py-4 rounded-2xl font-bold bg-blue-600 text-white disabled:bg-blue-400 flex justify-center items-center gap-2">
                {isSubmitting ? <><Loader2 className="animate-spin" /> Submitting...</> : "Complete Registration"}
              </button>
            )}
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .form-input-premium { width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 1rem; outline: none; }
        .form-input-premium:focus { border-color: #3b82f6; background: white; }
        .error-msg { color: #ef4444; font-size: 0.75rem; font-weight: 600; margin: 0.25rem 0 0 0.5rem; }
      `}} />
    </div>
  );
}
