import { router } from "../trpc";
import { authRouter } from "./auth";
import { balanceRouter } from "./balance";

export const appRouter = router({
	balance: balanceRouter,
	auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
