import type { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const sessionCookie = req.headers.cookie
    ?.split("; ")
    .find((c) => c.startsWith("JSESSIONID="))
    ?.split("=")[1];

  if (!sessionCookie) {
    return new Response(
      JSON.stringify({
        data: {
          message: "Unauthorized",
        },
      }),
      { status: 401 }
    );
  }
  const userRes = await fetch(
    "http://localhost:9001/api/v1/user/current-user",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `JSESSIONID=${sessionCookie}`,
      },
    }
  );

  if (userRes.ok) {
    const userData = await userRes.json();
    return new Response(
      JSON.stringify({
        data: userData ? userData : {},
      }),
      { status: 200 }
    );
  } else {
    return new Response(
      JSON.stringify({
        data: { message: "Unauthorized" },
      }),
      { status: 401 }
    );
  }
}
