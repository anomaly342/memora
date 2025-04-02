"use client";

import { useState } from "react";
import { storage } from "@/utilities/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function ImageUpload() {
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const [imageUrl, setImageUrl] = useState("");

	const validateImage = (file: File): Promise<boolean> => {
		return new Promise((resolve) => {
			// ✅ Check file type
			if (!["image/png", "image/jpeg"].includes(file.type)) {
				setError("Only PNG and JPG files are allowed.");
				resolve(false);
				return;
			}

			// ✅ Check file size (1MB max)
			if (file.size > 1 * 1024 * 1024) {
				setError("File must be 1MB or smaller.");
				resolve(false);
				return;
			}

			// ✅ Check image dimensions
			const img = new Image();
			img.src = URL.createObjectURL(file);
			img.onload = () => {
				if (img.width > 1000 || img.height > 1000) {
					setError("Image dimensions must be 1000x1000 pixels or smaller.");
					resolve(false);
				} else {
					setError(null);
					resolve(true);
				}
			};
		});
	};

	const handleUpload = async () => {
		if (!file) return;
		setUploading(true);

		const isValid = await validateImage(file);
		if (!isValid) {
			setUploading(false);
			return;
		}

		const storageRef = ref(storage, `uploads/${file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log(`Upload is ${progress}% done`);
			},
			(error) => {
				console.error("Upload error:", error);
				setUploading(false);
			},
			async () => {
				const url = await getDownloadURL(uploadTask.snapshot.ref);
				setImageUrl(url);
				console.log("File available at", url);
				setUploading(false);
			}
		);
	};

	return (
		<div className="mt-4">
			<input
				type="file"
				accept="image/png, image/jpeg"
				className=""
				onChange={(e) => setFile(e.target.files?.[0] || null)}
			/>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<button onClick={handleUpload} disabled={uploading} className="bg-white ">
				{uploading ? "Uploading..." : "Upload"}
			</button>
			{imageUrl && <img src={imageUrl} alt="Uploaded" width="200" />}
		</div>
	);
}
