export default async function getTranscriptions(url) {
  const response = await fetch('https://tactiq-apps-prod.tactiq.io/transcript', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      langCode: "en",
      videoUrl: url
    })
  }) 

  const data = await response.json()
  return data
}