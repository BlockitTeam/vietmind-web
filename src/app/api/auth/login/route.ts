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
    // Get the Set-Cookie header from the backend response
    const setCookieHeader = authRes.headers.get("set-cookie");
    if (setCookieHeader) {
      // Extract JSESSIONID from the setCookieHeader if necessary
      const jsessionidMatch = setCookieHeader.match(/JSESSIONID=([^;]+);/);
      if (jsessionidMatch) {
        console.log("🚀 ~ POST ~ jsessionidMatch:", jsessionidMatch)
        const jsessionid = jsessionidMatch[1];

        // Set the JSESSIONID cookie in the response to the client
        res.setHeader(
          "Set-Cookie",
          `JSESSIONID=${jsessionid}; Path=/; HttpOnly`
        );
      }
    }
    return new Response(
      JSON.stringify({
        data: authRes ? authRes : [],
      }),
      { status: 200 }
    );
  } else {
    res.status(401).end();
  }
}
