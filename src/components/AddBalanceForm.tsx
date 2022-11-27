import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "./TextField";
import { day } from "../lib/dayjs";
import { trpc } from "../lib/trpc";

export const addBalanceFormSchema = z.object({
	value: z.preprocess(
		(u) => parseFloat(u as string),
		z
			.number()
			.multipleOf(0.01)
			.refine((v) => v !== 0, {
				message: "Balance must not be 0",
			})
	),
	date: z.preprocess((u) => new Date(u as string), z.date()),
	description: z.string(),
});
type AddBalanceFormSchema = z.infer<typeof addBalanceFormSchema>;

export const AddBalanceForm: React.FC = () => {
	const utils = trpc.useContext();
	const add = trpc.balance.add.useMutation();
	const form = useForm<AddBalanceFormSchema>({
		resolver: zodResolver(addBalanceFormSchema),
		defaultValues: {
			value: 1.0,
			date: day().format("YYYY-MM-DD") as unknown as Date,
		},
	});

	return (
		<form
			onSubmit={form.handleSubmit((values) => {
				add.mutate(values);
				utils.balance.list.invalidate();
			})}
		>
			<TextField
				input={{
					placeholder: "Description",
				}}
				form={form}
				label="Description"
				name="description"
			/>
			<TextField
				input={{
					type: "number",
					placeholder: "0,00",
					step: 0.01,
				}}
				form={form}
				label="Value"
				name="value"
			/>
			<TextField
				input={{
					type: "date",
				}}
				form={form}
				label="Date"
				name="date"
			/>

			<input type="submit" className="btn-primary btn mt-4" />
		</form>
	);
};
