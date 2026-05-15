import express from 'express'
import fetchGeminiApi from './utils/fetchGeminiApi.js'
import getTranscription from './utils/getTranscription.js'
import makeTextFile from './utils/makeTextFile.js'
import execGenerateWordcloudScript from './utils/execGenerateWordcloudScript.js'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3333

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}))

app.use(express.json())
app.use('/wordcloud', express.static('src/utils/wordcloud'))

app.post('/api', async (req, res) => {
  const { url } = req.body

  try {
    const transcription = await clearTranscription(await getTranscription(url))
    await makeTextFile(transcription, "text")

    const getCriticalPointsPrompt = `
      # ROLE
      Você é um analista narrativo especializado em decompor vídeos complexos em resumos estruturados por personagem. Seu foco é identificar acontecimentos importantes, conflitos, intenções ocultas, mudanças de comportamento e momentos críticos.

      # INPUT
      Transcrição do vídeo: ${transcription}
      
      # STEPS
      1. Identifique todos os personagens relevantes citados no vídeo.
      2. Para cada personagem:
        - descreva seu papel na narrativa;
        - identifique seus objetivos;
        - destaque conflitos e tensões;
        - liste decisões importantes;
        - identifique mudanças de comportamento ou posicionamento;
        - destaque momentos críticos envolvendo esse personagem.
      3. Detecte relações importantes entre personagens.
      4. Extraia falas, ações ou eventos com alto impacto narrativo.
      5. Ignore informações irrelevantes, repetitivas ou puramente contextuais.
      6. Priorize clareza e densidade informacional.
      
      # EXPECTATION  
      Retorne a resposta no seguinte formato, nada além disso:
    
      [
        {
          "character": "Nome do personagem",
          "critical_points": [
            "Ponto crítico 1",
            "Ponto crítico 2",
            "Ponto crítico 3"
          ]
        },
        ...
      ]
    `

    const criticalPointsResponse = await fetchGeminiApi(promptGetCritialPoints)
    const criticalPoints = JSON.parse(criticalPointsResponse)
    const characterNames = criticalPoints.map(point => point.character)

    const splitPhrasesPrompt = `
      # ROLE
      Você é um especialista em análise e segmentação de diálogos. Seu trabalho é identificar corretamente cada personagem e separar suas falas de forma limpa, organizada e precisa.

      # INPUT
      Transcrição do vídeo: ${transcription}
      Lista de personagens identificados: ${characterNames}

      # STEPS
      1. Analise a transcrição e identifique as falas de cada personagem com base nos nomes fornecidos.
      2. Separe as falas de cada personagem em blocos distintos (separados por quebras de linha), garantindo que cada bloco contenha apenas as falas de um personagem específico.
      3. Mantenha a ordem cronológica das falas conforme aparecem na transcrição original.
      4. Ignore informações irrelevantes, repetitivas ou puramente contextuais.
      5. Priorize clareza e organização na separação das falas.
      
      # EXPECTATION  
      Retorne a resposta no seguinte formato, nada além disso:

      [
        {
          "character": "Nome do personagem",
          "talk": "Falas do personagem, separadas por quebras de linha"
        },
        ...
      ]
    `

    const splitedTalkResponse = await fetchGeminiApi(splitPhrasesPrompt)
    const splitedTalk = JSON.parse(splitedTalkResponse)
    await makeTextFile(splitedTalk, "separatedTalk")

    await execGenerateWordcloudScript()

    res.status(200).json()
  }
  catch (err) {
    console.error(`An error have occurred: ${err}`)
    res.status(500).json({ err })
  }
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)) 