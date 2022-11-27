import { Magic } from "magic-sdk";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { AddBalanceForm } from "../components/AddBalanceForm";
import type { UserSession } from "../lib/iron-session";
import { withSessionSsr } from "../lib/iron-session";
import { trpc } from "../lib/trpc";

type Props = { user: UserSession };

const Home: NextPage<Props> = (props) => {
	const router = useRouter();
	const logout = trpc.auth.logout.useMutation({
		onSuccess() {
			router.push("/login");
		},
	});

	return (
		<div>
			Dashboard, you are logged in as {props.user.email}
			<button
				className="btn"
				onClick={async () => {
					await new Magic(
						process.env.NEXT_PUBLIC_MAGIC_PUB_KEY as string
					).user.logout();
					logout.mutate();
				}}
			>
				Logout
			</button>
			<AddBalanceForm />
		</div>
	);
};

export const getServerSideProps = withSessionSsr<Props>(
	async function getServerSideProps({ req }) {
		if (!req.session.user) {
			return {
				redirect: {
					permanent: true,
					destination: "/login",
				},
			};
		}

		return {
			props: {
				user: req.session.user,
			},
		};
	}
);

export default Home;
