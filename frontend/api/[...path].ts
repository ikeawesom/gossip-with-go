export const config = {
    runtime: "edge",
};

const BACKEND = "https://gossip-with-go.fly.dev";

export default async function handler(req: Request) {
    const url = new URL(req.url);
    console.log("[CONFIG] url:", url);

    const path = url.pathname.replace(/^\/api/, "");
    const targetUrl = BACKEND + path + url.search;

    const headers = new Headers(req.headers);

    headers.set("host", "gossip-with-go.fly.dev");

    const res = await fetch(targetUrl, {
        method: req.method,
        headers,
        body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
        redirect: "manual",
    });

    const responseHeaders = new Headers();
    res.headers.forEach((v, k) => responseHeaders.set(k, v));

    console.log("[CONFIG] res:", JSON.stringify(res));

    return new Response(res.body, {
        status: res.status,
        headers: responseHeaders,
    });
}
