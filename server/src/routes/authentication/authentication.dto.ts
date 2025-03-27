import { z } from 'zod';

export const DefaultLoginSchema = z.object({
  username: z
    .string()
    .min(5, 'Username must be between 5 and 13 characters')
    .max(13, 'Username must be between 5 and 13 characters')
    .regex(/^(?!.* {2})[a-zA-Z0-9_\-[\] ]+$/, 'No special characters allowed')
    .trim()
    .describe('test'),
  password: z
    .string()
    .min(6, 'Password must be between 6 and 23 characters')
    .max(23, 'Password must be between 6 and 23 characters')
    .regex(/^\S*$/, 'No spaces allowed')
    .describe('test'),
});

export const SignUpSchema = z
  .object({
    username: z
      .string()
      .min(5, 'Username must be between 5 and 13 characters')
      .max(13, 'Username must be between 5 and 13 characters')
      .regex(/^(?!.* {2})[a-zA-Z0-9_\-[\] ]+$/, 'No special characters allowed')
      .trim(),
    password: z
      .string()
      .min(6, 'Password must be between 6 and 23 characters')
      .max(23, 'Password must be between 6 and 23 characters')
      .regex(/^\S*$/, 'No spaces allowed'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export const JWTSchema = z.object({ jwt_token: z.string() });

export type JWTSchemaType = z.infer<typeof JWTSchema>;
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export type DefaultLoginSchemaType = z.infer<typeof DefaultLoginSchema>;
