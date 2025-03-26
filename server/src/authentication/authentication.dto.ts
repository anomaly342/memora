import { z } from 'zod';

export const DefaultLoginSchema = z.object({
  username: z
    .string()
    .min(5, 'Username must be between 5 and 13 characters')
    .max(13, 'Username must be between 5 and 13 characters')
    .regex(/^(?!.* {2})[a-zA-Z0-9_\-\[\] ]+$/, 'No special characters allowed')
    .trim()
    .describe('test'),
  password: z
    .string()
    .min(6, 'Password must be between 6 and 23 characters')
    .max(23, 'Password must be between 6 and 23 characters')
    .regex(/^\S*$/, 'No spaces allowed')
    .describe('test'),
});

export type DefaultLoginSchemaType = z.infer<typeof DefaultLoginSchema>;
