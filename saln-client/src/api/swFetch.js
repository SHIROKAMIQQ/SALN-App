import { queueRequest } from "./queueRequest.js";

export async function swFetch(url, options = {}) {
  const isOnline = navigator.onLine;

  if (isOnline) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      console.warn("[API] Online fetch failed — queuing:", err);
      await queueRequest(url, options);
      return new Response(
        JSON.stringify({ queued: true, message: "Request queued (network error)" }),
        { status: 202, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  console.warn("[API] Offline — queuing request:", url);
  await queueRequest(url, options);
  return new Response(
    JSON.stringify({ queued: true, message: "Offline: Request queued" }),
    { status: 202, headers: { "Content-Type": "application/json" } }
  );
}
