export default {
  async fetch(request, env) {
    // 1. Handle "Preflight" requests (CORS) so your browser doesn't block the call
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // 2. Only allow POST requests
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const incomingData = await request.json();

      // 3. Call the Ubiqitum API
      const response = await fetch("https://api.ubiqitum.com/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "ubiq_live_sk_R4tY8kLp2VnX7qZc1FmD9sHa6Bw3JgKe0UxTrNvW"
        },
        body: JSON.stringify({
          model: "qwen2.5:14b",
          prompt: incomingData.prompt,
          stream: false
        })
      });

      const result = await response.json();

      // 4. Return the answer back to Webflow with CORS headers
      return new Response(JSON.stringify(result), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
};
