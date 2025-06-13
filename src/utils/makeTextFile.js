import { writeFile } from 'fs/promises'

export default async function makeTextFile(transcription) {
  let text = ''

  transcription.captions.forEach(element => {
    if (element.text.length > 5 && element.text != '[Música]') {
      text += `${element.text} `
    }
  })
  
  await writeFile('./src/utils/text_files/text.txt', text, 'utf-8')
  return text
}