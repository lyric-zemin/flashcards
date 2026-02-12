import axios from 'axios'
import qs from 'querystring'
import fs from 'fs'
import path from 'path'

/**
 * 百度语音合成API配置
 */
// const BAIDU_APP_ID = '7437668' // 替换为你的百度AppID
const BAIDU_API_KEY = 'H74ivkHtbsqvwo66h9jR4Vd4' // 替换为你的百度API Key
const BAIDU_SECRET_KEY = 'd7jpepg40BI6zg6sayW0d2domw8CKDq6' // 替换为你的百度Secret Key

/**
 * Token缓存
 */
interface TokenCache {
  token: string
  expireTime: number
}

let tokenCache: TokenCache | null = null

/**
 * 获取百度语音合成token
 * @returns token
 */
async function getBaiduToken() {
  // 检查缓存是否有效
  if (tokenCache && Date.now() < tokenCache.expireTime) {
    return tokenCache.token
  }

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

    const token = response.data.access_token
    const expiresIn = response.data.expires_in || 2592000 // 默认30天
    const expireTime = Date.now() + (expiresIn * 1000)

    // 更新缓存
    tokenCache = {
      token,
      expireTime
    }

    return token
  } catch (error) {
    console.error('获取百度语音token失败:', error)
    return null
  }
}

/**
 * 确保音频存储目录存在
 */
function ensureAudioDirectoryExists() {
  const audioDir = path.join(__dirname, '..', '..', 'public', 'audio')
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true })
  }
  return audioDir
}

/**
 * 生成汉字音频URL
 * @param character 汉字
 * @returns 音频URL
 */
export async function generateAudioUrl(character: string) {
  try {
    // 确保音频目录存在
    const audioDir = ensureAudioDirectoryExists()
    // 使用汉字的Unicode编码作为文件名，避免URL编码问题
    const filename = `${character.charCodeAt(0)}.mp3`
    const audioFilePath = path.join(audioDir, filename)
    const audioUrl = `/audio/${filename}`

    // 检查音频文件是否已存在
    if (fs.existsSync(audioFilePath)) {
      return audioUrl
    }

    // 获取token
    const token = await getBaiduToken()
    if (token) {
      // https://console.bce.baidu.com/support/?_=1668482508529#/api?product=AI&project=%E8%AF%AD%E9%9F%B3%E6%8A%80%E6%9C%AF&parent=%E8%AF%AD%E9%9F%B3%E5%90%88%E6%88%90&api=text2audio&method=post
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
          per: 0,
          cuid: 'Flashcards'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          responseType: 'arraybuffer'
        }
      )

      // 保存音频文件
      fs.writeFileSync(audioFilePath, audioData.data)
      
      // 返回音频URL
      return audioUrl
    }

    // 如果获取token失败，返回空字符串
    return ''
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
