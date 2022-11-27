import { addBalanceFormSchema } from "../../../components/AddBalanceForm";

import { router, protectedProcedure } from "../trpc";

export const balanceRouter = router({
	add: protectedProcedure
		.input(addBalanceFormSchema)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.balance.create({
				data: {
					user: {
						connect: {
							id: ctx.session.user.id,
						},
					},
					...input,
				},
			});
		}),
	list: protectedProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.balance.findMany({
			where: {
				user_id: ctx.session.user.id,
			},
		});
	}),
});
