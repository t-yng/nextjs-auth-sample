import { GetServerSideProps } from "next";
import Error from "./_error";
import { FC } from "react";
import { withAuthSsr } from "../helpers/withAuthSsr";
import { useRouter } from "next/router";

type Props = {
  user: {
    name: string;
  };
  token: string;
  errorCode: number | null;
};

const Home: FC<Props> = ({ user, errorCode }) => {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; max-age=0";
    router.replace("/signin");
  };

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }
  return (
    <>
      <h1>Hello, {user.name}!</h1>
      <button onClick={handleLogout}>ログアウト</button>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuthSsr(
  async ({ token, user, errorCode }) => {
    return {
      props: {
        user,
        token,
        errorCode,
      },
    };
  }
);

export default Home;
