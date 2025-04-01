"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	AddDeckSchema,
	AddDeckSchemaType,
} from "@/types/form/AddDeckSchema.types";
import Link from "next/link";
import { PiPlusCircle } from "react-icons/pi";

export default function AddDeckModal({
	showAddDeck,
	setShowAddDeck,
}: {
	showAddDeck: boolean;
	setShowAddDeck: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<AddDeckSchemaType>({
		resolver: zodResolver(AddDeckSchema),
		mode: "onChange",
		defaultValues: {
			tags: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "tagHandler",
	});

	const [newTag, setNewTag] = useState("");
	const [showTagPopup, setShowTagPopup] = useState(false);

	const addTag = () => {
		if (newTag.trim()) {
			append({ name: newTag.trim() });
			setNewTag("");
			setShowTagPopup(false);
		}
	};

	useEffect(() => {
		console.log(fields);
	}, [fields]);

	return (
		<div
			className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${
				showAddDeck ? "" : "hidden"
			}`}
		>
			<div className="bg-white px-6 py-8 rounded-md shadow-lg flex flex-col max-w-96">
				<label htmlFor="deckName" className="text-cool-grey-500 text-sm">
					Deck Name
				</label>
				<input
					type="text"
					id="deckName"
					className="border-b border-b-blue-vivid-400 w-40 p-1 mt-1 focus:outline-none"
					{...register("deckName", { required: true })}
				/>
				{errors.deckName && (
					<p className="w-64 text-sm text-red-500 mt-1">
						{errors.deckName.message}
					</p>
				)}

				{/* Tags Section */}
				<label className="text-cool-grey-500 mt-6 text-sm flex items-center">
					Tags
					<PiPlusCircle
						className="ml-2 text-blue-500 cursor-pointer size-6"
						onClick={() => setShowTagPopup(true)}
					/>
				</label>
				<div className="flex mt-3 gap-2 flex-wrap">
					{fields.map((tag, index) => (
						<div key={tag.id} className="flex items-center gap-1">
							<p className="bg-cool-grey-050 text-cool-grey-500 text-sm px-1 py-0.5">
								{tag.name}
							</p>
							<button
								className="text-red-500 text-sm"
								type="button"
								onClick={() => remove(index)}
							>
								✖
							</button>
						</div>
					))}
				</div>

				{/* Add Tag Popup */}
				{showTagPopup && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
						<div className="bg-white p-4 rounded-md shadow-lg flex flex-col">
							<input
								type="text"
								className="border p-2 rounded-md"
								value={newTag}
								onChange={(e) => setNewTag(e.target.value)}
							/>
							<div className="flex justify-end gap-2 mt-2">
								<button
									className="px-4 py-2 bg-gray-300 rounded"
									onClick={() => setShowTagPopup(false)}
								>
									Cancel
								</button>
								<button
									className="px-4 py-2 bg-blue-500 text-white rounded"
									onClick={addTag}
								>
									Add
								</button>
							</div>
						</div>
					</div>
				)}

				<label htmlFor="desc" className="text-cool-grey-500 mt-6 text-sm">
					Description
				</label>
				<input
					type="text"
					className="border-b border-b-blue-vivid-400 p-1 mt-1 focus:outline-none w-56"
					{...register("description")}
				/>

				<div className="flex justify-end gap-2 mt-4">
					<Link href="/library" className="px-4 py-2 bg-gray-300 rounded">
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
