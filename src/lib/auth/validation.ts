import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long.')
    .max(72, 'Password must be less than 72 characters.'),
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters.')
    .max(50, 'Display name must be less than 50 characters.')
    .optional(),
});

export type AuthInput = z.infer<typeof authSchema>;

export function validateAuthCredentials(input: unknown): {
  success: boolean;
  data?: AuthInput;
  error?: string;
} {
  const result = authSchema.safeParse(input);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return {
      success: false,
      error: firstIssue ? firstIssue.message : 'Invalid credentials provided.',
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
