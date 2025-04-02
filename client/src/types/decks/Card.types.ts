export interface Flashcard {
	uuid: string;
	front: string;
	back: string;
	ease: number | null;
	status: "new" | "learning" | "review";
	step: number | null;
	interval: number | null;
	scheduled_review: string | null;
	goodStreak?: number | 0;
}

export interface Cards {
	cards: Flashcard[];
}
