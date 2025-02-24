import fetch from "node-fetch";

// Enable CORS
const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (or specify your frontend URL)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return await fn(req, res);
};

const handler = async (req, res) => {
  // Handle both POST and GET requests
  const query = req.method === "POST" ? req.body.query : req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const WOLFRAM_APP_ID = process.env.WOLFRAM_APP_ID; // Use environment variable
  const WOLFRAM_API_URL = "https://api.wolframalpha.com/v1/result";

  try {
    const params = new URLSearchParams({
      appid: WOLFRAM_APP_ID,
      i: query,
    });

    const response = await fetch(`${WOLFRAM_API_URL}?${params}`);

    if (!response.ok) {
      if (response.status === 501) {
        throw new Error("This operation is not supported. Try simplifying your input or breaking it into steps.");
      }
      throw new Error("Failed to get response from Wolfram Alpha");
    }

    const result = await response.text();
    res.status(200).send(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message || "An error occurred while processing your request" });
  }
};

// Wrap the handler with CORS support
export default allowCors(handler);