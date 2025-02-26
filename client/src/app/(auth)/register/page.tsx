"use client";

import { SignUpSchema, SignUpSchemaType } from "@/types/registrationForm";
import { useForm, UseFormRegister, FieldError } from "react-hook-form";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import montserrat from "@/fonts/Montserrat";
import Link from "next/link";

const { SERVER_URL } = process.env;

const LabeledInput = ({
	label,
	name,
	type,
	register,
	error,
}: {
	label: string;
	name: keyof SignUpSchemaType;
	type: string;
	register: UseFormRegister<SignUpSchemaType>;
	error: FieldError | undefined;
}) => {
	return (
		<>
			<label className="mb-1 text-base font-bold text-cool-grey-600">
				{label}
			</label>
			<input
				className={`h-11 w-64 border border-cool-grey-400 px-2 py-3 rounded-md focus:outline-2 outline-blue-500 ${
					error
						? "mb-1 border-red-500 "
						: "mb-4 [&:not(:placeholder-shown)]:border-green-600"
				}`}
				type={type}
				{...register(name)}
				placeholder=" "
				required
			/>
		</>
	);
};

const Form = () => {
	const {
		register,
		handleSubmit,
		watch,

		formState: { errors },
	} = useForm<SignUpSchemaType>({
		resolver: zodResolver(SignUpSchema),
		mode: "onChange",
	});
	const router = useRouter();
	const onSubmit = async (data: SignUpSchemaType) => {
		try {
			const response = await fetch(`${SERVER_URL}/auth/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				router.push("/");
			} else {
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
				className="h-11 w-64 bg-blue-vivid-400 text-cool-grey-050 text-xl font-bold rounded-sm mt-6"
			>
				Sign up
			</button>
		</form>
	);
};

export default function RegisterPage() {
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
