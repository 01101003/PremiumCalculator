import fetch from "node-fetch"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { query } = req.body

  if (!query) {
    return res.status(400).json({ error: "Query is required" })
  }

  const WOLFRAM_APP_ID = 'JH52EH-UAKWTEXGXQ'
  const WOLFRAM_API_URL = "https://api.wolframalpha.com/v1/result"

  try {
    const params = new URLSearchParams({
      appid: WOLFRAM_APP_ID,
      i: query,
    })

    const response = await fetch(`${WOLFRAM_API_URL}?${params}`)

    if (!response.ok) {
      if (response.status === 501) {
        throw new Error("This operation is not supported. Try simplifying your input or breaking it into steps.")
      }
      throw new Error("Failed to get response from Wolfram Alpha")
    }

    const result = await response.text()
    res.status(200).send(result)
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ error: error.message || "An error occurred while processing your request" })
  }
}
