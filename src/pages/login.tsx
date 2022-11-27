import { type NextPage } from "next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Magic } from "magic-sdk";
import { trpc } from "../lib/trpc";
import { useRouter } from "next/router";
import { withSessionSsr } from "../lib/iron-session";

const loginFormSchema = z.object({
	email: z.string().email(),
});
type LoginFormSchema = z.infer<typeof loginFormSchema>;

const Home: NextPage = () => {
	const router = useRouter();
	const login = trpc.auth.login.useMutation({
		onSuccess() {
			router.push("/");
		},
	});
	const form = useForm<LoginFormSchema>({
		resolver: zodResolver(loginFormSchema),
	});

	return (
		<form
			onSubmit={form.handleSubmit(async (data) => {
				const didToken = await new Magic(
					process.env.NEXT_PUBLIC_MAGIC_PUB_KEY as string
				).auth.loginWithMagicLink({
					email: data.email,
					redirectURI: new URL("/callback", window.location.origin).href, // optional redirect back to your app after magic link is clicked
				});
				if (typeof didToken !== "string") {
					console.error("returned token is not string");
					return;
				}

				login.mutate({ token: didToken });
			})}
		>
			<div className="form-control w-full max-w-xs">
				<label className="label">
					<span className="label-text">Email</span>
				</label>
				<input
					type="email"
					placeholder="foo@bar.baz"
					className="input-bordered input w-full max-w-xs"
					{...form.register("email")}
				/>
			</div>

			<input type="submit" className="btn-primary btn mt-4" />
		</form>
	);
};

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req }) {
		if (req.session.user) {
			return {
				redirect: {
					permanent: true,
					destination: "/",
				},
			};
		}

		return {
			props: {},
		};
	}
);

export default Home;
