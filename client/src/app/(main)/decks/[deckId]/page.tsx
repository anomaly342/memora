"use client";

import { useParams } from "next/navigation";
import { string } from "zod";
import cover from "@/assets/sample_cover.webp";
export default function DeckInfoPage() {
	const params: Record<"deckId", string> = useParams();

	return (
		<div
			className="w-full h-44 relative"
			style={{ backgroundImage: `url(${cover.src})` }}
		>
			<div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
		</div>
	);
}
