import { deckWithoutCards } from "@/types/decks/decksWithoutCards.types";

const getDecksList = async () => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/decks`, {
		method: "GET",
		credentials: "include",
	});
	if (!response.ok) throw new Error("Failed to fetch decks");

	const json = (await response.json()) as deckWithoutCards[];
	return json;
};

export default getDecksList;
