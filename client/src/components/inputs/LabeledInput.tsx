import { SignUpSchemaType } from "@/types/form/SignUpSchema.types";
import { FieldError, UseFormRegister } from "react-hook-form";

export default function LabeledInput({
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
}) {
	return (
		<>
			<label
				className="[&:not(:first-child)]:mt-3 mb-1 text-base font-bold text-cool-grey-600"
				htmlFor={name}
			>
				{label}
			</label>
			<input
				className={`h-11 w-64 transition-all duration-200 border border-cool-grey-400 px-2 py-3 rounded-md focus:outline-2 outline-blue-500 ${
					error
						? "border border-red-500"
						: "[&:not(:placeholder-shown)]:border [&:not(:placeholder-shown)]:border-green-600 [&:not(:placeholder-shown)]:focus:border-transparent"
				}`}
				type={type}
				id={name}
				{...register(name, { required: true })}
				placeholder=" "
			/>
		</>
	);
}
