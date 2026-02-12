import axios from 'axios'
import qs from 'querystring'

/**
 * 百度语音合成API配置
 */
const BAIDU_API_KEY = 'your_api_key' // 替换为你的百度API Key
const BAIDU_SECRET_KEY = 'your_secret_key' // 替换为你的百度Secret Key

/**
 * 获取百度语音合成token
 * @returns token
 */
async function getBaiduToken() {
  try {
    const response = await axios.get(
      'https://aip.baidubce.com/oauth/2.0/token',
      {
        params: {
          grant_type: 'client_credentials',
          client_id: BAIDU_API_KEY,
          client_secret: BAIDU_SECRET_KEY
        }
      }
    )
    return response.data.access_token
  } catch (error) {
    console.error('获取百度语音token失败:', error)
    return null
  }
}

/**
 * 生成汉字音频URL
 * @param character 汉字
 * @param pinyin 拼音
 * @returns 音频URL
 */
export async function generateAudioUrl(character: string) {
  try {
    // 这里使用模拟的音频URL，实际项目中需要集成真实的TTS服务
    // 例如使用百度语音合成API
    const token = await getBaiduToken()
    if (token) {
      const audioData = await axios.post(
        'https://tsn.baidu.com/text2audio',
        qs.stringify({
          tex: character,
          lan: 'zh',
          ctp: 1,
          tok: token,
          spd: 5,
          pit: 5,
          vol: 15,
          per: 0
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          responseType: 'arraybuffer'
        }
      )
      // 保存音频文件并返回URL
      return audioData.data
    }

    // 模拟音频URL，实际项目中需要替换为真实的音频文件URL
    return `https://example.com/audio/${encodeURIComponent(character)}.mp3`
  } catch (error) {
    console.error('生成音频URL失败:', error)
    return ''
  }
}

/**
 * 批量为卡片生成音频URL
 * @param flashcards 卡片数据
 * @returns 带有音频URL的卡片数据
 */
export async function batchGenerateAudioUrls(flashcards: Array<{
  character: string
}>): Promise<Array<{
  character: string
  audioUrl: string
}>> {
  const results = await Promise.all(
    flashcards.map(async (card) => {
      const audioUrl = await generateAudioUrl(card.character)
      return {
        ...card,
        audioUrl
      }
    })
  )
  return results
}
