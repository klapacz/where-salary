import { Magic } from "@magic-sdk/admin";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { wrap } from "../../../lib/errgo";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
	login: publicProcedure
		.input(z.object({ token: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const [error, user] = await wrap(
				new Magic(env.MAGIC_SECRET_KEY).users.getMetadataByToken(input.token)
			);
			if (error) {
				// TODO: better Magic errors handling
				if ("data" in error) {
					console.error("Magic error ", (error as any).data);
				}
				throw new TRPCError({ code: "UNAUTHORIZED", cause: error });
			}

			if (!user.email) {
				throw new TRPCError({ code: "UNAUTHORIZED" });
			}

			ctx.req.session.user = {
				email: user.email,
			};
			await ctx.req.session.save();
		}),

	logout: protectedProcedure.mutation(async ({ ctx }) => {
		ctx.req.session.destroy();
	}),
});
