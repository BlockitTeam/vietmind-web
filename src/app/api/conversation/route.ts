import type { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const {publicKey, id} = req.body;
    console.log("🚀 ~ POST ~ publicKey:", req.body)

  const userRes = await fetch(
    `/api/v1/conversation/${id}/encrypt-key`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({publicKey})
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
