import Image from "next/image";
import bg from "@/assets/polygon_bg.png";
import cover from "@/assets/sample_cover.webp";
import Link from "next/link";
import { IoPersonOutline } from "react-icons/io5";

export default function HomePage() {
	return (
		<main>
			<div
				className="w-full h-56 bg-contain px-6 py-8 flex flex-col justify-between"
				style={{ backgroundImage: `url(${bg.src})` }}
			>
				<p className="text-white text-xl">
					You have <span className="text-red-vivid-500">42</span> pending cards
				</p>

				<Link
					href="/library"
					className="bg-blue-vivid-400 text-white text-lg font-bold px-3 py-3 w-fit rounded-sm"
				>
					Go to Library
				</Link>
			</div>
			<div className="pt-8 px-6">
				<h1 className="text-2xl ">Trending Decks</h1>
				<div className="mt-4 mb-3">
					<div className="flex pl-3 gap-2">
						<Link
							href={"/decks/63450asdasxc232"}
							className="w-24 h-32 bg-cover"
							style={{ backgroundImage: `url(${cover.src})` }}
						></Link>
						<div className="flex flex-col justify-between">
							<h3 className="text-cool-grey-700 font-bold text-base">
								Basic Geometric Formulas
							</h3>
							<p className="text-blue-vivid-400">
								<Link href={"/tags/Math"}>Math</Link>,{" "}
								<Link href={"/tags/Geometry"}>Geometry</Link>
							</p>
							<p className="text-cool-grey-800">223 cards</p>
							<div className="flex items-center gap-1">
								<IoPersonOutline className="size-4" />
								<p className="text-blue-vivid-400">
									<Link href={"/profiles/Kenn13123"}>@Kenn13123</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="mb-3">
					<div className="flex pl-3 gap-2">
						<div
							className="w-24 h-32 bg-cover"
							style={{ backgroundImage: `url(${cover.src})` }}
						></div>
						<div className="flex flex-col justify-between">
							<h3 className="text-cool-grey-700 font-bold text-base">
								Basic Geometric Formulas
							</h3>
							<p className="text-blue-vivid-400">
								<Link href={"/tags/Math"}>Math</Link>,{" "}
								<Link href={"/tags/Geometry"}>Geometry</Link>
							</p>
							<p className="text-cool-grey-800">223 cards</p>
							<div className="flex items-center gap-1">
								<IoPersonOutline className="size-4" />
								<p className="text-blue-vivid-400">
									<Link href={"/profiles/Kenn13123"}>@Kenn13123</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
