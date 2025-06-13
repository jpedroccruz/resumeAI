export default async function fetchGeminiApi(prompt) {
  const API_KEY = process.env.API_KEY

  const response = fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  })

  const data = (await response).json()

  return (await data).candidates[0].content.parts[0].text
}