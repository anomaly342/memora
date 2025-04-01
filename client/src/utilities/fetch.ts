import { decksWithoutCards } from "@/types/decks/decksWithoutCards";

const getDecksList = async () => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/decks`, {
		method: "GET",
		credentials: "include",
	});
	if (!response.ok) throw new Error("Failed to fetch decks");

	const json = (await response.json()) as decksWithoutCards;
	return json;
};

export default getDecksList;
