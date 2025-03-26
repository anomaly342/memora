import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const NEXT_PUBLIC_GOOGLE_SIGN_IN_URL = process.env
	.NEXT_PUBLIC_GOOGLE_SIGN_IN_URL as string;

export default function GoogleButton() {
	return (
		<Link
			href={NEXT_PUBLIC_GOOGLE_SIGN_IN_URL}
			className="h-11 w-64 flex gap-3 items-center shadow-md p-2 mb-12"
		>
			<FcGoogle size={32}></FcGoogle>
			<p className="text-cool-grey-700 text-sm">Sign in with Google</p>
		</Link>
	);
}
