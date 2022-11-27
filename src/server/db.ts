import { PrismaClient } from "@prisma/client";

import { env } from "../env/server.mjs";

declare global {
	// eslint-disable-next-line no-var
	var __prisma: PrismaClient | undefined;
}

export const prisma =
	global.__prisma ||
	new PrismaClient({
		log:
			env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
	});

if (env.NODE_ENV !== "production") {
	global.__prisma = prisma;
}
