export default function SharedLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="grid place-content-center h-full">
			<div className="flex flex-col items-center">{children}</div>
		</div>
	);
}
