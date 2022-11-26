import { Magic } from "@magic-sdk/admin";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { wrap } from "@klapacz/errgo";
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

      const session = await ctx.getSession();
      session.user = {
        email: user.email,
      };
      session.save();
    }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
