export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    return new Response("VERCEL_DEPLOY_HOOK_URL not configured", {
      status: 500,
    });
  }

  await fetch(hookUrl, { method: "GET" });
  return new Response("OK");
}
