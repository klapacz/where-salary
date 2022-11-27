import type { UseFormReturn } from "react-hook-form";
import clsx from "clsx";

export const TextField = <T extends UseFormReturn<any>>(props: {
	input: JSX.IntrinsicElements["input"];
	form: T;
	name: T extends UseFormReturn<infer Values> ? keyof Values : never;
	label: string;
}) => {
	const error = props.form.formState.errors[props.name];

	return (
		<div className="form-control w-full max-w-xs">
			<label className="label">
				<span className="label-text">{props.label}</span>
			</label>
			<input
				className={clsx(
					"input-bordered input w-full max-w-xs",
					error && "input-error"
				)}
				{...props.input}
				{...props.form.register(props.name)}
			/>

			{error ? (
				<label className="label ">
					<span className="label-text-alt text-error">
						{error.message as string}
					</span>
				</label>
			) : null}
		</div>
	);
};
