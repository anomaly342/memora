"use client";

import { LoginSchema, LoginSchemaType } from "@/types/form/LoginSchema.types";
import { FieldError, useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AuthResponse } from "@/types/form/FormResponse.types";
import { useState } from "react";

import GoogleButton from "@/components/buttons/GoogleButton";
import Link from "next/link";
import WelcomeText from "@/components/misc/WelcomeText";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const InputField = ({
	label,
	name,
	type,
	register,
	error,
}: {
	label: string;
	name: keyof LoginSchemaType;
	type: string;
	register: UseFormRegister<LoginSchemaType>;
	error: FieldError | undefined;
}) => (
	<div className="mb-4">
		<input
			type={type}
			placeholder={label}
			{...register(name)}
			className={`h-11 w-64 transition-all duration-200 outline-none bg-cool-grey-050 px-2 py-3 rounded-md focus:ring-2 focus:ring-blue-vivid-300 focus:ring-opacity-100 focus:border-transparent ${
				error
					? "border border-red-500"
					: "[&:not(:placeholder-shown)]:border [&:not(:placeholder-shown)]:border-green-600 [&:not(:placeholder-shown)]:focus:border-transparent"
			}`}
		/>
		{error && <p className="mt-2 w-64 text-sm text-red-500">{error.message}</p>}
	</div>
);

export default function LoginPage() {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
	} = useForm<LoginSchemaType>({
		resolver: zodResolver(LoginSchema),
		mode: "onChange",
	});

	const [responseError, setResponseError] = useState<AuthResponse | null>(null);
	const router = useRouter();

	const login = async (data: LoginSchemaType) => {
		try {
			const response = await fetch(`${SERVER_URL}/authentication/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (response.ok) {
				router.push("/");
			} else {
				const json: AuthResponse = await response.json();
				setResponseError(json);
			}
		} catch (error) {
			console.error("Login Error:", error);
		}
	};

	return (
		<>
			<WelcomeText />
			<form
				className="grid place-content-center mb-6"
				onSubmit={handleSubmit(login)}
			>
				<InputField
					label="Username"
					type="text"
					name="username"
					register={register}
					error={errors.username}
				/>
				<InputField
					label="Password"
					type="password"
					name="password"
					register={register}
					error={errors.password}
				/>

				<button
					type="submit"
					className={`mt-4 h-11 w-64 text-xl font-bold rounded-sm ${
						isValid && !isSubmitting
							? "bg-blue-vivid-400 text-cool-grey-050"
							: "bg-cool-grey-300 text-cool-grey-050 cursor-not-allowed"
					}`}
					disabled={!isValid || isSubmitting}
				>
					Login
				</button>

				{responseError?.errors?.map((e, i) => (
					<p key={i} className="w-64 text-sm text-red-500">
						{e}
					</p>
				))}
			</form>

			<hr className="bg-cool-grey-200 w-80 mb-6" />
			<GoogleButton />

			<div className="text-center">
				<p className="text-cool-grey-900">Don&apos;t have an account?</p>
				<Link href="/register" className="text-blue-500 underline">
					Create an account
				</Link>
			</div>
		</>
	);
}
