// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  token: string | null;
  user: { name: string } | null;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body = JSON.parse(req.body);
  if (req.headers["authorization"] === "Token token=token") {
    return res.status(200).json({ token: null, user: { name: "太郎" } });
  }

  if (body.id === "test" && body.password === "password") {
    res.status(200).json({ token: "token", user: { name: "太郎" } });
  } else {
    res.status(401).send({ token: null, user: null });
  }
}
