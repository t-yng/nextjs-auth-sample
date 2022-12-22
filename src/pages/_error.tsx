import type { NextPage } from "next";
import type { ErrorProps } from "next/error";
import Link from "next/link";

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  console.info({ statusCode });
  if (statusCode === 401) {
    return (
      <p>
        <Link href="/signin">ログイン</Link>が必要です。
      </p>
    );
  } else {
    return <p>エラーが発生しました</p>;
  }
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res
    ? res.statusCode
    : err && err.statusCode
    ? err.statusCode
    : 404;
  return { statusCode };
};

export default Error;
