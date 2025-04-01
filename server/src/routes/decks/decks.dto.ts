import { z } from 'zod';

export interface deckWithoutCards {
  _id: string;
  deck_name: string;
  cover_img: string;
  card_amount: number;
  tags: string[];
  author: string;
  creation_date: Date;
  description: string;
  new: number;
  learn: number;
  review: number;
}

export const AddDeckSchema = z.object({
  deckName: z
    .string()
    .min(6, 'Deck name must be between 6 and 72 characters')
    .max(72, 'Deck name must be between 6 and 72 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must not be more than 1000 characters')
    .trim()
    .optional(),
  tags: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, 'Tag name is required')
          .regex(/^[A-Za-z\s]+$/, 'Tag must be in English'), // Inline validation for `name`
      }),
    )
    .min(1, 'At least one tag is required'), // Validate that the array has at least one tag
});

export type AddDeckSchemaType = z.infer<typeof AddDeckSchema>;
