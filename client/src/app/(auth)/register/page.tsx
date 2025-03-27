"use client";

import {
	SignUpSchema,
	SignUpSchemaType,
} from "@/types/form/SignUpSchema.types";
import { AuthResponse } from "@/types/form/FormResponse.types";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import LabeledInput from "@/components/inputs/LabeledInput";
import WelcomeText from "@/components/misc/WelcomeText";

const { SERVER_URL } = process.env;

export default function RegisterPage() {
	return (
		<div className="grid place-content-center h-full">
			<div className="flex flex-col items-center">
				<WelcomeText />
				<Form></Form>
				<hr className="bg-cool-grey-200 w-80 mb-6" />

				<div className="text-center">
					<p className="text-cool-grey-900">Have an account?</p>
					<Link href={"/login"} className="text-blue-500 underline">
						Log in now
					</Link>
				</div>
			</div>
		</div>
	);
}

const Form = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
	} = useForm<SignUpSchemaType>({
		resolver: zodResolver(SignUpSchema),
		mode: "onChange",
	});

	const [responseError, setResponseError] = useState<AuthResponse>(undefined);

	const router = useRouter();

	const onSubmit = async (data: SignUpSchemaType) => {
		try {
			const response = await fetch(`${SERVER_URL}/authentication/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				router.push("/");
			} else {
				const json: AuthResponse = await response.json();
				setResponseError(json);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<form
			className="grid place-content-center mb-6"
			onSubmit={handleSubmit(onSubmit)}
		>
			<LabeledInput
				label="Username"
				name="username"
				type="text"
				error={errors.username}
				register={register}
			></LabeledInput>
			{errors.username && (
				<p className="w-64 text-sm mb-4 text-red-500">
					{errors.username.message}
				</p>
			)}
			<LabeledInput
				label="Password"
				name="password"
				type="password"
				error={errors.password}
				register={register}
			></LabeledInput>
			{errors.password && (
				<p className="w-64 text-sm mb-4 text-red-500">
					{errors.password.message}
				</p>
			)}
			<LabeledInput
				label="Confirm Password"
				name="confirm_password"
				type="password"
				error={errors.confirm_password}
				register={register}
			></LabeledInput>
			{errors.confirm_password && (
				<p className="w-64 text-sm mb-4 text-red-500">
					{errors.confirm_password.message}
				</p>
			)}
			<button
				type="submit"
				className={`h-11 w-64 text-xl font-bold rounded-sm mt-6 ${
					isValid && !isSubmitting
						? "bg-blue-vivid-400 text-cool-grey-050"
						: "bg-cool-grey-300 text-cool-grey-050 cursor-not-allowed"
				}`}
				disabled={!isValid || isSubmitting}
			>
				Sign up
			</button>

			{responseError &&
				responseError.errors.map((e, i) => (
					<p className="w-64 text-sm mb-2 text-red-500" key={i}>
						{e}
					</p>
				))}
		</form>
	);
};
