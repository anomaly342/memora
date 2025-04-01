"use client";

import Link from "next/link";
export default function AddDeckModal() {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white px-6 py-8 rounded-md shadow-lg flex flex-col max-w-80">
				<label htmlFor="deckName" className="text-cool-grey-500 text-sm">
					Deck Name
				</label>
				<input
					type="text"
					className="border-b border-b-blue-vivid-400 w-40 p-1 mt-1 grey-500 focus:outline-none"
				/>

				<label htmlFor="tags" className="text-cool-grey-500 mt-6 text-sm">
					Tags
				</label>
				<div className="flex mt-3 gap-2 flex-wrap">
					<Link
						className="bg-cool-grey-050 text-cool-grey-500 text-sm px-1 py-0.5"
						href={"/tags/Math"}
					>
						Math
					</Link>
				</div>

				<label htmlFor="desc" className="text-cool-grey-500 mt-6 text-sm">
					Description
				</label>
				<input
					type="text"
					className="border-b border-b-blue-vivid-400 p-1 mt-1 grey-500 w-56 focus:outline-none"
				/>

				<div className="flex justify-end gap-2 mt-4">
					<Link href={"/library"} className="px-4 py-2 bg-gray-300 rounded">
						Cancel
					</Link>
					<button className="px-4 py-2 bg-blue-500 text-white rounded">
						Create
					</button>
				</div>
			</div>
		</div>
	);
}
