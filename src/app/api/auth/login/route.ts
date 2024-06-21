import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  const authRes = await fetch("http://localhost:9001/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (authRes.ok) {
    console.log("🚀 ~ onSubmit ~ res:", res)

    const cookies = authRes.headers.get("set-cookie");
    if (cookies) {
      res.setHeader("Set-Cookie", cookies);
    }
    return new Response(
      JSON.stringify({
        data: cookies ? cookies : [],
      }),
      { status: 200 }
    );
  } else {
    res.status(401).end();
  }
}
