import { z } from "zod";

const MAX_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/png", "image/jpeg"];
const MAX_DIMENSIONS = { width: 1000, height: 1000 };

export const AddDeckSchema = z.object({
	deckName: z
		.string()
		.min(6, "Deck name must be between 6 and 72 characters")
		.max(72, "Deck name must be between 6 and 72 characters")
		.trim(),
	description: z
		.string()
		.max(1000, "Description must not be more than 1000 characters")
		.trim()
		.optional(),
	tags: z
		.array(
			z.object({
				name: z
					.string()
					.min(1, "Tag name is required")
					.regex(/^[A-Za-z\s]+$/, "Tag must be in English"), // Inline validation for `name`
			})
		)
		.min(1, "At least one tag is required"), // Validate that the array has at least one tag
});

export type AddDeckSchemaType = z.infer<typeof AddDeckSchema>;
