import { writeFile } from 'node:fs/promises'

export default async function makeSeparatedTalkFile(separatedTalk) {
  await writeFile('./src/utils/text_files/separatedTalk.txt', separatedTalk, 'utf-8')
}