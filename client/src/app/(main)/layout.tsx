import Sidebar from "@/components/misc/Sidebar";
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
