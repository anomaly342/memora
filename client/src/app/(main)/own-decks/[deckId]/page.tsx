"use client";

import { deckWithoutCards } from "@/types/decks/decksWithoutCards.types";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import cover from "@/assets/sample_cover.webp";
import Link from "next/link";
import { useEffect } from "react";

export default function PreviewPage() {
	const params = useParams<{ deckId: string }>();
	const router = useRouter();
	const onDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/decks/${params.deckId}`,
			{ method: "DELETE", credentials: "include" }
		);

		if (response.ok) {
			router.push("/library");
		}
	};
	const { data, isFetching, isError } = useQuery({
		queryKey: ["getDeck"],
		queryFn: async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/decks/${params.deckId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			if (!response.ok) throw new Error("Failed to fetch decks");

			const json = (await response.json()) as deckWithoutCards;
			return json;
		},
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		console.log(data);
	}, [data]);
	if (isFetching) {
		return "loading";
	}

	if (isError) {
		return "Unauthorized";
	}

	return (
		<div>
			<Link href={"/library"}>
				<IoArrowBack
					className="absolute size-9 z-30 top-4 left-4"
					color="white"
				></IoArrowBack>
			</Link>
			<div
				className="w-full h-44 relative"
				style={{ backgroundImage: `url(${cover.src})` }}
			>
				<div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
			</div>
			<div className="px-5 relative h-full">
				<div className="flex absolute -top-28">
					<div
						className="w-32 h-44 bg-cover"
						style={{ backgroundImage: `url(${cover.src})` }}
					></div>
					<div className="flex flex-col h-full">
						<h1 className="text-2xl font-bold dtext-cool-grey-050 ml-5 text-gray-50">
							{data?.deck_name}
						</h1>
						<p className="text-lg mt-2 ml-5 text-gray-50">
							<span className="font-bold">{data?.card_amount}</span> cards
						</p>
						<div className="flex absolute top-20 gap-6 mt-10 ml-16">
							<div className="flex flex-col gap-0.5 items-center">
								<p className="text-cool-grey-800">New</p>
								<p className="text-blue-vivid-600 font-bold">{data?.new}</p>
							</div>
							<div className="flex flex-col gap-0.5 items-center">
								<p className="text-cool-grey-800">Learn</p>
								<p className="text-red-vivid-500 font-bold">{data?.learn}</p>
							</div>
							<div className="flex flex-col gap-0.5 items-center">
								<p className="text-cool-grey-800">Due</p>
								<p className="text-yellow-vivid-600 font-bold">
									{data?.review}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="h-full mt-32 grid place-content-center">
				<Link
					href={`/practice/${data?._id}`}
					className="text-lg font-bold bg-blue-vivid-400 text-cool-grey-050 w-60 py-2 rounded-md text-center"
				>
					Study
				</Link>
				<button
					onClick={(e) => onDelete(e)}
					className="text-lg mt-44 font-bold bg-red-vivid-500 text-cool-grey-050 w-60 py-2 rounded-md text-center"
				>
					Delete
				</button>
			</div>
		</div>
	);
}
