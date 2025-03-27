import montserrat from "@/components/fonts/Montserrat";

export default function WelcomeText() {
	return (
		<div className="flex flex-col items-center mb-11">
			<h2
				className={`text-4xl mb-3 ${montserrat.className} text-cool-grey-900`}
			>
				Welcome to
			</h2>
			<h1 className="text-5xl text-blue-vivid-700 font-bold">Memora.io</h1>
		</div>
	);
}
