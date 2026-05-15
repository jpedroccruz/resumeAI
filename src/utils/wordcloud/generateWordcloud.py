import json
from wordcloud import WordCloud
from os import remove
import matplotlib.pyplot as plt
import json

stopwords = open('./src/utils/text_files/stopwords.txt', mode='r', encoding='utf-8').read().splitlines()
separatedTalk = json.loads(open('./src/utils/text_files/separatedTalk.txt', mode='r', encoding='utf-8').read())
transcription = open('./src/utils/text_files/transcription.txt', mode='r', encoding='utf-8').read()

separatedTalk = json.loads(separatedTalk)

plt.rcParams["figure.figsize"] = (10, 5)

wordcloud = WordCloud(
  max_font_size=70,
  max_words=75,
  background_color="white",
  stopwords=stopwords,
  colormap='flag'
)

def createWordcloud(words, fileName):
  wordcloud.generate(words)

  plt.plot()
  plt.imshow(wordcloud, interpolation="bilinear")
  plt.axis("off")
  plt.savefig(f'./src/utils/wordcloud/_{fileName}')

if __name__ == '__main__':
  createWordcloud(transcription, 'wordcloud')

  for character in separatedTalk:
    createWordcloud(character["talk"], character["character"])
  
  remove('./src/utils/wordcloud/*.png')