import { useState } from "react";
import { NavLink,useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/registerSchema";
import { UserRoundPen, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { API_URL } from '../config';

export default function Register() {
  const [step, setStep] = useState(1);
  const [showPwd, setShowPwd] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const step1Fields = ["full_name", "phone", "email", "password", "confirmPassword"];
  const step2Fields = ["degree", "university", "graduation_year"];
  const step3Fields = ["work_type", "expected_salary", "skills"];

  const nextStep = async () => {
    const fields = step === 1 ? step1Fields : step2Fields;
    const valid = await trigger(fields);
    if (valid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data) => {
  delete data.confirmPassword;

  const formData = new FormData();

  // Append normal fields
  formData.append("full_name", data.full_name);
  formData.append("phone", data.phone);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("degree", data.degree);
  formData.append("university", data.university);
  formData.append("graduation_year", data.graduation_year);
  formData.append("work_type", data.work_type);
  formData.append("expected_salary", data.expected_salary);
  formData.append("skills", data.skills);

  // Append resume safely
  if (data.resume && data.resume.length > 0) {
    formData.append("resume", data.resume[0]);
  }

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      body: formData,   // 🚀 DO NOT set headers
    });

    const result = await res.json();

    if (res.ok) {
      alert("Registration successful 🎉");
      navigate("/login");
    } else {
      alert(JSON.stringify(result));
    }

  } catch (error) {
    console.error(error);
    alert("Upload failed");
  }
};   
    
  return (
   <>
    <header className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-700">
                       <NavLink to="/"> JobConnect</NavLink>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
                        <NavLink to="/job" className="hover:text-blue-700">Jobs</NavLink>
                        <NavLink to="/company" className="hover:text-blue-700">Companies</NavLink>
                        <a href="#" className="hover:text-blue-700">Services</a>
                        <NavLink to="/login" className="hover:text-blue-700 font-bold">Login</NavLink>
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
                        <NavLink to="/job" className="block text-gray-700 hover:text-blue-700">Jobs</NavLink>
                        <NavLink to="/company" className="block text-gray-700 hover:text-blue-700">Companies</NavLink>
                        <a href="#" className="block text-gray-700 hover:text-blue-700">Services</a>
                        <NavLink to="/login" className="block text-blue-700 font-bold">Login</NavLink>
                    </div>
                )}
            </header>

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-5"
      >
        <p className="text-center text-sm text-gray-500">Step {step} of 3</p>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="flex justify-center">
              <UserRoundPen className="text-blue-600" size={60} />
            </div>

            <h2 className="text-center text-lg font-bold">Account Details</h2>

            <input {...register("full_name")} placeholder="Full Name"
              className="w-full border p-3 rounded-lg" />
            <p className="text-red-500 text-xs">{errors.full_name?.message}</p>

            <input {...register("phone")} placeholder="Mobile Number"
              className="w-full border p-3 rounded-lg" />
            <p className="text-red-500 text-xs">{errors.phone?.message}</p>

            <input {...register("email")} placeholder="Email"
              className="w-full border p-3 rounded-lg" />
            <p className="text-red-500 text-xs">{errors.email?.message}</p>

            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="w-full border p-3 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-3 text-sm"
              >
                👁️
              </button>
            </div>
            <p className="text-red-500 text-xs">{errors.password?.message}</p>

            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm Password"
              className="w-full border p-3 rounded-lg"
            />
            <p className="text-red-500 text-xs">{errors.confirmPassword?.message}</p>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="flex justify-center">
              <GraduationCap className="text-blue-600" size={60} />
            </div>

            <h2 className="text-center text-lg font-bold">Education</h2>

            <input {...register("degree")} placeholder="Degree"
              className="w-full border p-3 rounded-lg" />
            <p className="text-red-500 text-xs">{errors.degree?.message}</p>

            <input {...register("university")} placeholder="University"
              className="w-full border p-3 rounded-lg" />
            <p className="text-red-500 text-xs">{errors.university?.message}</p>

            <input
              type="number"
              {...register("graduation_year", { valueAsNumber: true })}
              placeholder="Graduation Year"
              className="w-full border p-3 rounded-lg"
            />
            <p className="text-red-500 text-xs">{errors.graduation_year?.message}</p>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div className="flex justify-center">
              <BriefcaseBusiness className="text-green-600" size={60} />
            </div>

            <h2 className="text-center text-lg font-bold">Job Preferences</h2>

            <select {...register("work_type")}
              className="w-full border p-3 rounded-lg">
              <option value="">Select Work Type</option>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <p className="text-red-500 text-xs">{errors.work_type?.message}</p>

            <input
              type="number"
              {...register("expected_salary", { valueAsNumber: true })}
              placeholder="Expected Salary"
              className="w-full border p-3 rounded-lg"
            />
            <p className="text-red-500 text-xs">{errors.expected_salary?.message}</p>

            <textarea
              {...register("skills")}
              placeholder="Skills (React, Django, SQL)"
              className="w-full border p-3 rounded-lg"
            />
            <p className="text-red-500 text-xs">{errors.skills?.message}</p>

            <input
              type="file"
              accept=".pdf"
              {...register("resume")}
              className="w-full border p-3 rounded-lg"
            />
            <p className="text-red-500 text-xs">{errors.resume?.message}</p>
          </>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 border p-3 rounded-lg"
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 bg-blue-600 text-white p-3 rounded-lg"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white p-3 rounded-lg"
            >
              Register
            </button>
          )}
        </div>
      </form>
    </div>
  </>
  );
}
