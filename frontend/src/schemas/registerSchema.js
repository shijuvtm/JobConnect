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
    graduation_year: z.number({ invalid_type_error: "Enter a valid year" }),

    // STEP 3
    work_type: z.enum(["Onsite", "Hybrid", "Remote"], {
      errorMap: () => ({ message: "Please select a work type" }),
    }),
    expected_salary: z.number({ invalid_type_error: "Salary must be a number" }).min(1, "Enter expected salary"),
    skills: z.string().min(2, "Skills are required"),
    
    
    resume: z
      .any()
      .refine((files) => files?.length > 0, "Resume PDF is required")
      .refine(
        (files) => files?.[0]?.type === "application/pdf",
        "Only PDF files are accepted"
      )
      .refine(
        (files) => files?.[0]?.size <= 5 * 1024 * 1024, 
        "Max file size is 5MB"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
