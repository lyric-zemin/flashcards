import { PrismaClient } from '@prisma/client'
import { generateAudioUrl } from './tts'

const prisma = new PrismaClient()

/**
 * 批量更新已有的flashcard的音频URL
 */
async function updateAudioUrls() {
  try {
    console.log('开始更新flashcard的音频URL...')

    // 获取所有flashcard
    const flashcards = await prisma.flashcard.findMany()
    
    // 过滤需要更新的flashcard
    const flashcardsToUpdate = flashcards.filter(card => 
      !card.audioUrl || 
      card.audioUrl === '' || 
      card.audioUrl.startsWith('https://example.com')
    )

    console.log(`找到 ${flashcardsToUpdate.length} 个需要更新音频URL的flashcard`)

    // 批量更新音频URL
    let updatedCount = 0
    for (const flashcard of flashcardsToUpdate) {
      try {
        console.log(`正在处理: ${flashcard.character}`)
        const audioUrl = await generateAudioUrl(flashcard.character)
        
        if (audioUrl) {
          await prisma.flashcard.update({
            where: { id: flashcard.id },
            data: { audioUrl }
          })
          updatedCount++
          console.log(`更新成功: ${flashcard.character} -> ${audioUrl}`)
        } else {
          console.log(`生成音频URL失败: ${flashcard.character}`)
        }

        // 避免请求过快，添加短暂延迟
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`处理 ${flashcard.character} 时出错:`, error)
      }
    }

    console.log(`更新完成，成功更新了 ${updatedCount} 个flashcard的音频URL`)
  } catch (error) {
    console.error('更新音频URL时出错:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 执行更新
updateAudioUrls()
