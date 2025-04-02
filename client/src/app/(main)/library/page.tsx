"use client";

import { PiSquaresFour, PiListDashesBold } from "react-icons/pi";
import { useQuery } from "@tanstack/react-query";

import Skeleton from "react-loading-skeleton";
import getDecksList from "@/utilities/fetch";
import "react-loading-skeleton/dist/skeleton.css";
import AddDeckModal from "@/components/inputs/AddDeckModal";
import { useState } from "react";
import React from "react";
import Link from "next/link";

export default function LibraryPage() {
	const { data, isFetching, isError } = useQuery({
		queryKey: ["deckList"],
		queryFn: getDecksList,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		retryOnMount: false,
		retry: false,
	});

	const [showAddDeck, setShowAddDeck] = useState<boolean>(false);
	return (
		<main className="pt-3 px-6">
			<AddDeckModal
				showAddDeck={showAddDeck}
				setShowAddDeck={setShowAddDeck}
			></AddDeckModal>
			<h1 className="font-bold text-3xl ">Library</h1>
			<div className="my-2 flex px-2 justify-between items-center">
				<div className="flex gap-3">
					<button
						onClick={() => setShowAddDeck(true)}
						className="text-cool-grey-700 border border-cool-grey-800 px-2 py-0.5 rounded-md"
					>
						Add a deck
					</button>
					<button className="text-cool-grey-700 border border-cool-grey-800 px-2 py-0.5 rounded-md">
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
				<div
					className="grid grid-cols-[50%_16.6%_16.6%_16.6%] pr-4"
					style={{ gridTemplateRows: `32px repeat(${data?.length}, 54px)` }}
				>
					<p className="justify-self-center text-cool-grey-800 ">Deck</p>
					<p className="justify-self-end text-cool-grey-800">New</p>
					<p className="justify-self-end text-cool-grey-800">Learn</p>
					<p className="justify-self-end text-cool-grey-800">Due</p>
					{data?.map((e, i) => (
						<React.Fragment key={i}>
							<Link
								href={"/own-decks/" + e._id}
								className="text-lg text-blue-vivid-400 self-center"
							>
								{e.deck_name}
							</Link>
							<p className="justify-self-end self-center text-blue-600 font-bold">
								{e.new}
							</p>
							<p className="justify-self-end self-center text-red-vivid-500 font-bold">
								{e.learn}
							</p>
							<p className="justify-self-end self-center text-yellow-vivid-600 font-bold">
								{e.review}
							</p>
						</React.Fragment>
					))}
				</div>
			)}
		</main>
	);
}
