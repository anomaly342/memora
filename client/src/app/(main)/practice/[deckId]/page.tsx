"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Cards, Flashcard } from "@/types/decks/Card.types";

async function fetchCards(deckId: string): Promise<Cards> {
	const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
	const apiUrl = `${serverUrl}/decks/${deckId}/cards`;
	const res = await fetch(apiUrl, {
		method: "GET",
		credentials: "include",
	});

	console.log(res.ok);
	if (!res.ok) {
		throw new Error(`Failed to fetch deck data for ID: ${deckId}`);
	}

	return res.json() as Promise<Cards>;
}

async function updateCardInDatabase(
	updatedCard: Flashcard,
	deckId: string
): Promise<Flashcard> {
	const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
	const apiUrl = `${serverUrl}/decks/${deckId}/cards`;

	// สร้าง payload ตามรูปแบบที่ต้องการ
	const payload = {
		uuid: updatedCard.uuid,
		goodStreak: updatedCard.goodStreak,
		ease: updatedCard.ease || null,
		status: updatedCard.status || "new",
		step: updatedCard.step || null,
		interval: updatedCard.interval || 1,
		scheduled_review: updatedCard.scheduled_review || null,
	};
	console.log(payload);
	const res = await fetch(apiUrl, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		throw new Error(`Failed to update card with ID: ${updatedCard.uuid}`);
	}

	return res.json();
}

export default function Practice() {
	const { deckId } = useParams();
	const deckIdStr = Array.isArray(deckId) ? deckId[0] : deckId;

	const {
		data: deckData,
		isLoading,
		isError,
		error,
	} = useQuery<Cards, Error>({
		queryKey: ["deck", deckIdStr],
		queryFn: () => fetchCards(deckIdStr as string),
		enabled: !!deckIdStr,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		retryOnMount: false,
		retry: false,
	});

	const { mutate: updateCardMutation } = useMutation<
		Flashcard,
		Error,
		Flashcard,
		unknown
	>({
		mutationFn: (updatedCard) =>
			updateCardInDatabase(updatedCard, deckId as string),
		onSuccess: (updatedCard: Flashcard) => {
			setDeck((prevDeck) => {
				if (!prevDeck) return null;

				return {
					...prevDeck,
					cards: prevDeck.cards.map((card) =>
						card.uuid === updatedCard.uuid ? updatedCard : card
					),
				};
			});

			setFlashcards((prev: Flashcard[]) => {
				return prev.map((card) =>
					card.uuid === updatedCard.uuid ? updatedCard : card
				);
			});
		},
		onError: (error: Error) => {
			console.error("Failed to update card:", error);
		},
	});

	const [deck, setDeck] = useState<Cards | null>(null);

	useEffect(() => {
		console.log(deckData);
		if (deckData) {
			setDeck(deckData);
		}
	}, [deckData]);

	const [flashcards, setFlashcards] = useState<Flashcard[]>([
		{
			uuid: "1",
			front: "What is React?",
			back: "A JavaScript library for building user interfaces",
			ease: null,
			status: "new",
			step: null,
			interval: null,
			scheduled_review: null,
		},
	]);
	const [showAnswer, setShowAnswer] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const router = useRouter();

	useEffect(() => {
		if (!deck) return;

		const currentISODate = new Date().toISOString();
		const filteredCards = deck.cards.filter((card) => {
			if (
				card.status === "new" ||
				card.status === "learning" ||
				(card.status === "review" &&
					(!card.scheduled_review || card.scheduled_review <= currentISODate))
			) {
				return true;
			}
			return false;
		});

		const sortedCards = [...filteredCards].sort((a, b) => {
			if (a.status === "new" && b.status !== "new") return -1;
			if (a.status !== "new" && b.status === "new") return 1;
			if (a.status === "learning" && b.status === "review") return -1;
			if (a.status === "review" && b.status === "learning") return 1;

			if (a.scheduled_review && b.scheduled_review) {
				const aTime = new Date(a.scheduled_review).getTime();
				const bTime = new Date(b.scheduled_review).getTime();
				const now = new Date().getTime();

				return aTime - now - (bTime - now);
			}

			return 0;
		});

		setFlashcards(sortedCards);
		setCurrentIndex(0);
		setShowAnswer(false);
	}, [deck]);

	useEffect(() => {
		if (
			flashcards.length === 0 &&
			!isLoading &&
			deck &&
			deck.cards.length > 0
		) {
			router.push("/home");
		} else if (currentIndex >= flashcards.length && flashcards.length > 0) {
			setCurrentIndex(0);
			setShowAnswer(false);
		}
		console.log(flashcards);
	}, [flashcards, router, currentIndex, deck]);

	const moveToNextCard = () => {
		setCurrentIndex((prev) => {
			const nextIndex = prev + 1;
			return nextIndex;
		});
		setShowAnswer(false);
	};

	const handleRatingClick = (rating: "again" | "hard" | "good" | "easy") => {
		if (!flashcards.length || currentIndex >= flashcards.length) {
			return;
		}

		const currentFlashcard = flashcards[currentIndex];
		if (!currentFlashcard) {
			console.log("here");
			return;
		}

		const now = new Date();
		const updatedCard = { ...currentFlashcard };

		if (updatedCard.status === "new") {
			updatedCard.status = "learning";
			updatedCard.step = 0;
			updatedCard.ease = 0;
		}

		if (updatedCard.status === "learning") {
			updatedCard.step = updatedCard.step || 0;

			if (rating === "again") {
				updatedCard.step = 0;
				updatedCard.scheduled_review = new Date(
					now.getTime() + 40 * 60 * 1000
				).toISOString();
				updatedCard.goodStreak = 0;
			} else if (rating === "hard") {
				updatedCard.step = Math.max(0, (updatedCard.step || 0) - 1);
				const minutesToAdd = [1, 10, 1440][updatedCard.step || 0];
				updatedCard.scheduled_review = new Date(
					now.getTime() + minutesToAdd * 60 * 1000
				).toISOString();
				updatedCard.goodStreak = (updatedCard.goodStreak || 0) - 1;
			} else if (rating === "easy") {
				updatedCard.status = "review";
				updatedCard.ease = 200;
				updatedCard.interval = 1;
				updatedCard.scheduled_review = new Date(
					now.getTime() + 24 * 60 * 60 * 1000
				).toISOString();
			} else if (rating === "good") {
				updatedCard.step = (updatedCard.step || 0) + 1;
				const minutesToAdd = [1, 10, 1440][Math.min(updatedCard.step || 0, 2)];
				updatedCard.scheduled_review = new Date(
					now.getTime() + minutesToAdd * 60 * 1000
				).toISOString();
				updatedCard.goodStreak = (updatedCard.goodStreak || 0) + 1;
				if (updatedCard.goodStreak >= 3) {
					updatedCard.status = "review";
					updatedCard.ease = 200;
					updatedCard.interval = 1;
					updatedCard.scheduled_review = new Date(
						now.getTime() + 24 * 60 * 60 * 1000
					).toISOString();
					updatedCard.goodStreak = 0;
				}
			}
		} else if (updatedCard.status === "review") {
			updatedCard.ease = updatedCard.ease || 200;
			updatedCard.interval = updatedCard.interval || 1;

			if (rating === "easy") {
				updatedCard.ease += 15;
				updatedCard.interval = Math.ceil(
					(updatedCard.ease / 100) * (updatedCard.interval || 1)
				);
			} else if (rating === "good") {
				updatedCard.interval = Math.ceil(
					(updatedCard.ease / 100) * (updatedCard.interval || 1)
				);
			} else if (rating === "hard") {
				updatedCard.ease = Math.max(0, (updatedCard.ease || 0) - 15);
				updatedCard.interval = Math.ceil(
					(updatedCard.ease / 100) * (updatedCard.interval || 1)
				);
			} else if (rating === "again") {
				updatedCard.ease = null;
				updatedCard.interval = null;
				updatedCard.scheduled_review = new Date(
					now.getTime() + 1 * 60 * 1000
				).toISOString();
				updatedCard.status = "learning";
			}

			if (updatedCard.status === "review" && updatedCard.interval) {
				updatedCard.scheduled_review = new Date(
					now.getTime() + (updatedCard.interval || 1) * 24 * 60 * 60 * 1000
				).toISOString();
			}
		}

		// Trigger the mutation to update the card on the backend
		updateCardMutation(updatedCard, {
			onSuccess: () => {
				setShowAnswer(false); // Move to the next card unless it was an "easy" rating on a review card
				if (!(rating === "easy" && updatedCard.status === "review")) {
					moveToNextCard();
				}
			},
		});

		setShowAnswer(false);
	};

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<div className="text-xl">Error loading deck: {error?.message}</div>
				<button
					onClick={() => router.push("/home")}
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
				>
					Return to Home
				</button>
			</div>
		);
	}

	if (!deck) {
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<div className="text-xl">Failed to load deck data.</div>
				<button
					onClick={() => router.push("/home")}
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
				>
					Return to Deck
				</button>
			</div>
		);
	}

	const statusCount = flashcards.reduce(
		(acc, card) => {
			acc[card.status] = (acc[card.status] || 0) + 1;
			return acc;
		},
		{ new: 0, learning: 0, review: 0 }
	);

	const currentFlashcard = flashcards[currentIndex];

	const handleShowAnswerClick = () => {
		setShowAnswer(true);
	};

	return (
		<main>
			<div className="w-full h-full flex flex-col items-center">
				{flashcards.length > 0 && currentFlashcard ? (
					<div className="shadow-xl rounded-xl mt-16 w-[500px] max-w-full">
						<div className="shadow-md rounded-md min-h-[460px]">
							<div className="min-h-[230px] bg-yellow-300 flex items-center justify-center">
								<div className="text-gray-800 text-3xl font-bold text-center break-words p-4">
									{currentFlashcard.front}
								</div>
							</div>
							{!showAnswer ? (
								<div
									className="h-[230px] flex items-center justify-center cursor-pointer"
									onClick={handleShowAnswerClick}
								>
									<div className="text-gray-500 text-2xl font-bold">
										SHOW ANSWER
									</div>
								</div>
							) : (
								<div className="flex flex-col items-center p-4 min-h-[230px]">
									<div className="text-gray-800 text-3xl font-bold text-center break-words p-2">
										{currentFlashcard.back}
									</div>
									<div className="mt-6 flex justify-around p-4">
										{(["again", "hard", "good", "easy"] as const).map(
											(rating) => (
												<button
													key={rating}
													className={`ml-5 px-4 py-2 rounded-md text-white font-bold ${
														rating === "again"
															? "bg-gray-400"
															: rating === "hard"
															? "bg-gray-600"
															: rating === "good"
															? "bg-blue-500"
															: "bg-green-500"
													}`}
													onClick={() => handleRatingClick(rating)}
												>
													{rating.charAt(0).toUpperCase() + rating.slice(1)}
												</button>
											)
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center h-screen">
						<div className="text-xl">
							No flashcards available for review at the moment.
						</div>
						<button
							onClick={() => router.push("/home")}
							className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
						>
							Return to Deck
						</button>
					</div>
				)}
				<div className="mt-4 text-lg font-semibold">
					Total Cards: {flashcards.length} | New: {statusCount.new} | Learning:{" "}
					{statusCount.learning} | Review: {statusCount.review}
					Current Index: {currentIndex}
				</div>
			</div>
		</main>
	);
}
