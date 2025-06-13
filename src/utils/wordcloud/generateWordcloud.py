from wordcloud import WordCloud
import matplotlib.pyplot as plt

# Abre e pega o conteúdo dos arquivos de texto
stopwords = open('./src/utils/text_files/stopwords.txt', mode='r', encoding='utf-8').read().splitlines()
separatedTalk = open('./src/utils/text_files/separatedTalk.txt', mode='r', encoding='utf-8').read().split('\n\n') 
text = open('./src/utils/text_files/text.txt', mode='r', encoding='utf-8').read()

# Insere o texto separado em variáveis diferentes para cada candidatos
lodovico = separatedTalk[0]
adriana = separatedTalk[1]

# Configuração do tamanho da imagem
plt.rcParams["figure.figsize"] = (10, 5)

# Configuração do Wordcloud
wordcloud = WordCloud(
  max_font_size=50,
  max_words=75,
  background_color="white",
  stopwords=stopwords,
  colormap='flag')

# Função que cria os Wordclouds
def createWordcloud(words, fileName):
  wordcloud.generate(words)

  plt.plot()
  plt.imshow(wordcloud, interpolation="bilinear")
  plt.axis("off")
  plt.savefig(f'./src/utils/wordcloud/_{fileName}')

if __name__ == '__main__':
  # Cria os 3 wordclouds
  createWordcloud(text, 'wordcloud')
  createWordcloud(lodovico, 'lodovico')
  createWordcloud(adriana, 'adriana')