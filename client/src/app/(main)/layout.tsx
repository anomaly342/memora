import Sidebar from "@/components/misc/Sidebar";
import { cookies } from "next/headers";
export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Sidebar></Sidebar>
			{children}
		</>
	);
}
