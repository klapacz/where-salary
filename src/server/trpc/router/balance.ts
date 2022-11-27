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
		const [balances, aggregated] = await ctx.prisma.$transaction([
			ctx.prisma.balance.findMany({
				where: {
					user_id: ctx.session.user.id,
				},
			}),
			ctx.prisma.balance.aggregate({
				_sum: {
					value: true,
				},
			}),
		]);

		return { balances, aggregated };
	}),
});
