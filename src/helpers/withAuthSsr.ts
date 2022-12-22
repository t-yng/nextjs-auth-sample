import { withIronSessionSsr } from "iron-session/next";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

type User = {
  name: string;
};

type AuthResult = {
  token: string | null;
  user: User | null;
  errorCode: number | null;
};

export const withAuthSsr = <
  P extends {
    [key: string]: unknown;
  } = {
    [key: string]: unknown;
  }
>(
  handler: (
    context: GetServerSidePropsContext & AuthResult
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) =>
  withIronSessionSsr<P>(
    async (context) => {
      const { req } = context;
      const token = req.cookies["token"] ?? null;

      if (token == null) {
        await req.session.destroy();
        return handler({
          ...context,
          user: null,
          token: null,
          errorCode: 401,
        });
      }

      // @ts-ignore
      const user = req.session.user;
      if (user != null) {
        return handler({ ...context, user, token, errorCode: null });
      }

      const res = await fetch("http://0.0.0.0:3000/api/login", {
        method: "POST",
        headers: {
          authorization: `Token token=${req.cookies["token"]}`,
        },
        body: JSON.stringify({}),
      });

      if (res.status === 200) {
        const { user } = await res.json();
        // @ts-ignore
        req.session.user = user;
        await req.session.save();
        return handler({ ...context, user, token, errorCode: null });
      } else {
        return handler({
          ...context,
          user: null,
          token: null,
          errorCode: 401,
        });
      }
    },
    {
      cookieName: "myapp_cookiename",
      password: "complex_password_at_least_32_characters_long",
      // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
      cookieOptions: {
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
