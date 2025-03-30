"use client";

import { RxHamburgerMenu } from "react-icons/rx";
import { IoHomeOutline, IoLibraryOutline } from "react-icons/io5";
import { IoIosSearch, IoIosStats } from "react-icons/io";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SidebarElement from "@/components/misc/SidebarElement";
import Image from "next/image";
import Logo from "@/assets/memora_logo.png";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [showSidebar, setShowsidebar] = useState<boolean>(false);
	const pathname = usePathname();

	useEffect(() => {}, [pathname]);
	return (
		<>
			<div className="p-4 flex justify-between items-center border-b border-b-blue-vivid-400">
				<div className="flex gap-3 items-center">
					<Image className="size-8" src={Logo} alt="logo"></Image>
					<h3 className="font-bold uppercase">Memora</h3>
				</div>
				<div className="flex gap-3 items-center">
					<IoIosSearch className="size-8"></IoIosSearch>
					<RxHamburgerMenu
						onClick={() => {
							setShowsidebar(true);
						}}
						className="size-8"
					></RxHamburgerMenu>
				</div>

				{/* sidebar */}

				<div
					className={`absolute top-0 left-0 h-full w-64 bg-white z-10 ${
						showSidebar ? "" : "hidden"
					}`}
				>
					<div className="flex gap-3 items-center p-4">
						<Image className="size-8" src={Logo} alt="logo"></Image>
						<h3 className="uppercase">Memora</h3>
					</div>
					<div className="p-4 w-full">
						<p className="text-sm text-gray-600">Logged in as</p>
						<h2 className="text-xl font-bold text-gray-800">example_name</h2>
					</div>

					<SidebarElement
						Icon={IoHomeOutline}
						name="home"
						pathname={pathname}
					></SidebarElement>
					<SidebarElement
						Icon={IoLibraryOutline}
						name="library"
						pathname={pathname}
					></SidebarElement>
					<SidebarElement
						Icon={IoIosStats}
						name="stats"
						pathname={pathname}
					></SidebarElement>
				</div>
				<div
					className={`absolute bg-black top-0 left-0 h-full w-full opacity-40 ${
						showSidebar ? "" : "hidden"
					}`}
					onClick={() => setShowsidebar(false)}
				></div>
			</div>
			{children}
		</>
	);
}
