import { z } from "zod";

export const registerSchema = z
  .object({
    // STEP 1
    full_name: z.string().min(3, "Full name is required"),
    phone: z.string().min(10, "Enter valid mobile number"),
    email: z.string().email("Invalid email"),
    password: z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),

    // STEP 2
    degree: z.string().min(2, "Degree required"),
    university: z.string().min(2, "University required"),
    graduation_year: z.number(),

    // STEP 3
    work_type: z.enum(["Onsite", "Hybrid", "Remote"]),
    expected_salary: z.number(),
    skills: z.string().min(2, "Skills required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
