import { z } from "zod"

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "กรอกอีเมลหรือชื่อผู้ใช้"),
  password: z.string().min(1, "กรอกรหัสผ่าน"),
})

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "อย่างน้อย 3 ตัวอักษร")
      .max(30, "ไม่เกิน 30 ตัวอักษร")
      .regex(
        /^[A-Za-z][A-Za-z0-9_]*$/,
        "ใช้อักษรอังกฤษ ตัวเลข และ _ เท่านั้น และต้องขึ้นต้นด้วยตัวอักษร"
      ),
    displayName: z.string().min(1, "กรอกชื่อที่แสดง").max(60),
    email: z.string().email("อีเมลไม่ถูกต้อง"),
    password: z.string().min(6, "อย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string().min(6, "อย่างน้อย 6 ตัวอักษร"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  })

export const reviewSchema = z.object({
  rating: z.number().min(1, "ให้คะแนนอย่างน้อย 1 ดาว"),
  content: z.string().optional(),
})

export const displayNameSchema = z.object({
  displayName: z.string().min(1, "กรอกชื่อที่แสดง").max(60),
})

export const usernameSchema = z.object({
  username: z.string().min(3, "อย่างน้อย 3 ตัวอักษร").max(30),
})

export const emailChangeSchema = z.object({
  newEmail: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรอกรหัสผ่าน"),
})

export const passwordChangeSchema = z.object({
  oldPassword: z.string().min(1, "กรอกรหัสผ่านเดิม"),
  newPassword: z.string().min(6, "อย่างน้อย 6 ตัวอักษร"),
})
