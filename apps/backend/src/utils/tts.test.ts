import { generateAudioUrl } from "./tts"

generateAudioUrl('中')
  .then(audioUrl => {
    console.log(audioUrl)
  })
  .catch(error => {
    console.error('生成音频URL失败:', error)
  })