const { z } = require("zod");

const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50), 

  username: z
    .string()
    .min(3)
    .max(20)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can contain only letters, numbers and underscores"
    ),

  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase and number"
    ),

  role: z
    .enum([
      "candidate",
      "recruiter",
    ])
    .optional(),
});

const loginSchema = z.object({
  email: z
    .string()
    .email(),

  password: z
    .string()
    .min(1),
});

const forgotPasswordSchema =
  z.object({
    email: z
      .string()
      .email(),
  });

const resetPasswordSchema =
  z.object({
    token: z.string(),

    password: z
      .string()
      .min(8),
  });

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};