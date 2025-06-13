import express from 'express'
import fetchGeminiApi from './utils/fetchGeminiApi.js'
import getTranscription from './utils/getTranscription.js'
import makeTextFile from './utils/makeTextFile.js'
import makeSeparatedTalkFile from './utils/makeSeparatedTalkFile.js'
import execGenerateWordcloudScript from './utils/execGenerateWordcloudScript.js'

const app = express()
const PORT = process.env.PORT || 3333

app.use(express.json())
app.use('/wordcloud', express.static('src/utils/wordcloud'))

app.post('/api', async (req, res) => {
  const { url } = req.body

  try {
    const transcription = await makeTextFile(await getTranscription(url))

    const promptGetTranscription = `
      ${transcription}.Analise o texto que contém as falas de um debate entre dois candidatos, Lodovico e Adriana.
      Separe todas as falas do Lodovico e apresente-as juntas, na ordem em que aparecem no texto, uma fala por linha.
      Após as falas do Lodovico, deixe uma linha em branco para separar.
      Em seguida, faça o mesmo com todas as falas da Adriana, também organizadas na ordem original, uma fala por linha.
      O formato final deve ser assim, nada além:
      
      fala 1 do Lodovico
      fala 2 do Lodovico
      fala 3 do Lodovico
      
      fala 1 da Adriana
      fala 2 da Adriana
      fala 3 da Adriana
    `

    const promptGetCritialPoints = `
      ${transcription}. Analise o texto que contém as falas de dois candidatos, Adriana e Lodovico, em um debate. Para cada candidato, identifique e destaque os pontos críticos positivos em suas falas — ou seja, os argumentos, ideias ou propostas que são considerados fortes, relevantes e construtivos para o tema discutido. Apresente um resumo desses pontos para Adriana e outro para Lodovico, destacando o que há de mais impactante em suas intervenções.
      O formato final deve ser assim, nada além:

      ponto 1 da adriana;
      ponto 2 da adriana:
      ponto 3 da adriana;
      ...

      ponto 1 do lodovico;
      ponto 2 do lodovico;
      ponto 3 do lodovico;
      ...
    `

    const separatedTalk = await fetchGeminiApi(promptGetTranscription)
    await makeSeparatedTalkFile(separatedTalk)

    const criticalPointsResponse = await fetchGeminiApi(promptGetCritialPoints)
    const criticalPoints = criticalPointsResponse.split('\n\n')
    
    res.status(200).json({ adriana: criticalPoints[0], lodovico: criticalPoints[1] })

    await execGenerateWordcloudScript()
  } 
  catch(err) {
    console.error(`An error had occurred: ${err}`)
    res.status(500).json({ err })
  }
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)) 