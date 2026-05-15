import { writeFile } from 'fs/promises'

export default async function makeTextFile(text, filename) {
  await writeFile(`./src/utils/text_files/${filename}.txt`, text, 'utf-8')
}