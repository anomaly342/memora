import montserrat from "@/fonts/Montserrat";
import GoogleButton from "@/components/buttons/GoogleButton";
import Link from "next/link";
export default function LoginPage() {
	return (
		<div className="grid place-content-center h-full">
			<div className="flex flex-col items-center">
				<div className="flex flex-col items-center mb-11">
					<h2
						className={`text-4xl mb-3 ${montserrat.className} text-cool-grey-900`}
					>
						Welcome to
					</h2>
					<h1 className="text-5xl text-blue-vivid-700 font-bold">Memora.io</h1>
				</div>
				<form className="grid place-content-center mb-6">
					<input
						className="h-11 w-64 bg-cool-grey-050 px-2 py-3 mb-4 rounded-sm"
						type="text"
						placeholder="Username"
					/>
					<input
						className="h-11 w-64 bg-cool-grey-050 px-2 py-3 mb-9 rounded-sm"
						type="password"
						placeholder="Password"
					/>
					<button className="h-11 w-64 bg-blue-vivid-400 text-cool-grey-050 text-xl font-bold rounded-sm">
						Login
					</button>
				</form>
				<hr className="bg-cool-grey-200 w-80 mb-6" />
				<GoogleButton></GoogleButton>

				<div className="text-center">
					<p className="text-cool-grey-900">Don't have an account?</p>
					<Link href={"/register"} className="text-blue-500 underline">
						Create an account
					</Link>
				</div>
			</div>
		</div>
	);
}
