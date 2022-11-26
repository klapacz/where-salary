import { type NextPage } from "next";
import type { UserSession } from "../lib/iron-session";
import { withSessionSsr } from "../lib/iron-session";

type Props = { user: UserSession };

const Home: NextPage<Props> = (props) => {
  return <div>Dashboard, you are logged in as {props.user.email}</div>;
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
