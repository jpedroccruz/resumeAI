import { exec } from 'node:child_process'

export default async function execGenerateWordcloudScript() {
  exec('python ./src/utils/wordcloud/generateWordcloud.py', (err, outputErr) => {
    if (err) {
      console.error(`Erro ao executar o script Python: ${err}`)
    }
    if (outputErr) {
      console.error(`Erro de saída do Python: ${outputErr}`)
    }
  })
}