import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/registerSchema";
import { UserRoundPen, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [step, setStep] = useState(1);
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  // FIX: Only validate fields present in the current step
  const next = async () => {
    let fieldsToValidate = [];
    if (step === 1) {
      fieldsToValidate = ["full_name", "phone", "email", "password", "confirmPassword"];
    } else if (step === 2) {
      fieldsToValidate = ["degree", "university", "graduation_year"];
    }

    const valid = await trigger(fieldsToValidate);
    if (valid) setStep(step + 1);
  };

  const back = () => setStep(step - 1);

  const onSubmit = async (data) => {
    const { confirmPassword, ...postData } = data; // Cleaner way to remove confirmPassword

    const res = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    const result = await res.json();
    alert(res.ok ? "Registered successfully 🎉" : JSON.stringify(result));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-5"
      >
        <div className="flex flex-col items-center mb-4">
          <UserRoundPen className="text-blue-600 mb-2" size={60}/>
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-sm text-gray-400">Step {step} of 2</p> 
          {/* Note: I adjusted steps to 2 since we moved items, or keep 3 if Step 2 is now different */}
        </div>

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input {...register("full_name")} placeholder="Full Name" className="input pl-10" />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input {...register("phone")} placeholder="Mobile Number" className="input pl-10" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input {...register("email")} placeholder="Email Address" className="input pl-10" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showPwd ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="input px-10"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm Password"
                className="input pl-10"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>
        )}

        {/* STEP 2: Education & Skills */}
        {step === 2 && (
          <div className="space-y-4">
            <input {...register("degree")} placeholder="Degree" className="input" />
            <input {...register("university")} placeholder="University" className="input" />
            <input
              type="number"
              {...register("graduation_year", { valueAsNumber: true })}
              placeholder="Graduation Year"
              className="input"
            />
            <textarea
              {...register("skills")}
              placeholder="Skills (Comma separated)"
              className="input min-h-[100px]"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <button type="button" onClick={back} className="w-1/2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Back
            </button>
          )}

          <button 
            type="button" 
            onClick={step < 2 ? next : handleSubmit(onSubmit)} 
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-200"
          >
            {step < 2 ? "Continue" : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
}
