import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2).max(100),
    username: z.string().min(3).max(30).regex(/^[a-z0-9-]+$/),
    email: z.email(),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});
