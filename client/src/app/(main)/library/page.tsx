"use client";

import { PiSquaresFour, PiListDashesBold } from "react-icons/pi";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import getDecksList from "@/utilities/fetch";
import "react-loading-skeleton/dist/skeleton.css";
import AddDeckModal from "@/components/inputs/AddDeckModal";
import Link from "next/link";

export default function LibraryPage() {
	const { data, isFetching, isError } = useQuery({
		queryKey: ["deckList"],
		queryFn: getDecksList,
		staleTime: 1000 * 60 * 5,
	});

	const searchParams = useSearchParams();
	const showAddDeck = searchParams?.get("showAdd");

	return (
		<main className="pt-3 px-6">
			{showAddDeck === "true" && <AddDeckModal></AddDeckModal>}
			<h1 className="font-bold text-3xl ">Library</h1>
			<div className="my-2 flex px-2 justify-between items-center">
				<div className="flex gap-3">
					<Link
						href={"/library?showAdd=true"}
						className="text-cool-grey-700 text-lg border border-cool-grey-800 px-2 py-0.5 rounded-md"
					>
						Add a deck
					</Link>
					<button className="text-cool-grey-700 text-lg border border-cool-grey-800 px-2 py-0.5 rounded-md">
						Filter
					</button>
				</div>

				<div className="flex gap-1">
					<PiListDashesBold
						color="white"
						className="size-6 bg-blue-vivid-400"
					/>
					<PiSquaresFour className="size-6" />
				</div>
			</div>
			{isFetching ? (
				<Skeleton
					className="first:mt-4 mix-blend-multiply"
					count={8}
				></Skeleton>
			) : isError ? (
				"not found"
			) : (
				<div className="grid grid-cols-[50%_16.6%_16.6%_16.6%] grid-rows-[32px,_repeat(99,56px)] pr-4">
					<p className="justify-self-center text-cool-grey-800 ">Deck</p>
					<p className="justify-self-end text-cool-grey-800">New</p>
					<p className="justify-self-end text-cool-grey-800">Learn</p>
					<p className="justify-self-end text-cool-grey-800">Due</p>
					{data?.map((e) => (
						<>
							<p className="text-lg text-blue-vivid-400 self-center">
								{e.deck_name}
							</p>
							<p className="justify-self-end self-center text-blue-600 font-bold border-b">
								{e.new}
							</p>
							<p className="justify-self-end self-center text-red-vivid-500 font-bold">
								{e.learn}
							</p>
							<p className="justify-self-end self-center text-yellow-vivid-600 font-bold">
								{e.review}
							</p>
						</>
					))}
				</div>
			)}
		</main>
	);
}
