import type { IronSessionOptions } from "iron-session";
import { getIronSession } from "iron-session";
import { withIronSessionSsr } from "iron-session/next";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { env } from "../env/server.mjs";

const ironOptions: IronSessionOptions = {
  cookieName: "cookie",
  password: env.IRON_SESSION_PASSWORD,
  cookieOptions: {
    secure: env.NODE_ENV === "production",
  },
};

export async function getSession({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const session = await getIronSession(req, res, ironOptions);
  return session;
}

export function withSessionSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, ironOptions);
}

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      email: string;
    };
  }
}
