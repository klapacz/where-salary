import type { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import type {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
	NextApiHandler,
} from "next";
import { env } from "../env/server.mjs";

const sessionOptions: IronSessionOptions = {
	password: env.IRON_SESSION_PASSWORD,
	cookieName: "myapp_cookiename",
	// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
	},
};

export function withSessionRoute(handler: NextApiHandler) {
	return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr<
	P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
	handler: (
		context: GetServerSidePropsContext
	) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
	return withIronSessionSsr(handler, sessionOptions);
}

export type UserSession = {
	email: string;
	id: string;
};

declare module "iron-session" {
	interface IronSessionData {
		user?: UserSession;
	}
}
