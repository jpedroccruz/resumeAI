export default function clearTranscription(transcription) {
  let text = ''

  transcription.captions.forEach(element => {
    if (element.text.length > 5 && element.text != '[Música]') {
      text += `${element.text} `
    }
  })

  return text
}