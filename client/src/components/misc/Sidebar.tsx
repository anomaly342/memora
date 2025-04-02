"use client";

import { RxHamburgerMenu } from "react-icons/rx";
import { IoHomeOutline, IoLibraryOutline } from "react-icons/io5";
import { IoIosSearch, IoIosStats } from "react-icons/io";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarElement from "@/components/misc/SidebarElement";
import Image from "next/image";
import Logo from "@/assets/memora_logo.png";
import { useQuery } from "@tanstack/react-query";
import { UserResponse } from "@/types/users/UserResponse";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Sidebar() {
	const [showSidebar, setShowsidebar] = useState<boolean>(false);
	const { data, isError, isLoading, isSuccess } = useQuery({
		queryKey: ["getOwnUser"],
		queryFn: async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/users`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			const userInfo = (await response.json()) as UserResponse;
			return userInfo;
		},
	});

	const pathname = usePathname();

	return (
		<>
			<div
				className={`p-4 flex justify-between items-center border-b border-b-blue-vivid-400 ${
					pathname.startsWith("/decks")
						? "absolute bg-transparent w-full z-10 border-b-0"
						: " "
				} ${pathname.startsWith("/own-decks") ? "hidden" : " "}
			`}
			>
				<div className="flex gap-3 items-center">
					<Image className="size-8" src={Logo} alt="logo"></Image>
					<h3
						className={`font-bold uppercase ${
							pathname.startsWith("/decks") ? "text-white" : ""
						}`}
					>
						Memora
					</h3>
				</div>
				<div className="flex gap-3 items-center">
					<IoIosSearch
						color={`${pathname.startsWith("/decks") ? "white" : ""} `}
						className="size-8"
					></IoIosSearch>
					<RxHamburgerMenu
						color={`${pathname.startsWith("/decks") ? "white" : ""} `}
						onClick={() => {
							setShowsidebar(true);
						}}
						className="size-8"
					></RxHamburgerMenu>
				</div>

				{/* sidebar */}
			</div>
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
					{/* <h2 className="text-xl font-bold text-gray-800">example_name</h2> */}
					<h2 className="text-xl font-bold text-gray-800">
						{isLoading ? <Skeleton /> : isError ? "not found" : data?.name}
					</h2>
				</div>

				<SidebarElement
					Icon={IoHomeOutline}
					name="home"
					pathname={pathname}
					setShowSidebar={setShowsidebar}
				></SidebarElement>
				<SidebarElement
					Icon={IoLibraryOutline}
					name="library"
					pathname={pathname}
					setShowSidebar={setShowsidebar}
				></SidebarElement>
				<SidebarElement
					Icon={IoIosStats}
					name="stats"
					pathname={pathname}
					setShowSidebar={setShowsidebar}
				></SidebarElement>
			</div>
			<div
				className={`absolute bg-black top-0 left-0 h-full w-full opacity-40 ${
					showSidebar ? "" : "hidden"
				}`}
				onClick={() => setShowsidebar(false)}
			></div>
		</>
	);
}
