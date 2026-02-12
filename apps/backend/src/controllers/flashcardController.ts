import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { generateAudioUrl } from '../utils/tts'

const prisma = new PrismaClient()

/**
 * 创建卡片
 * @param req 请求对象
 * @param res 响应对象
 */
export async function createFlashcard(req: Request, res: Response) {
  try {
    const { character, pinyin, meaning, imageUrl, audioUrl, ageGroupId } = req.body

    if (!character || !pinyin || !meaning || !ageGroupId) {
      return res.status(400).json({ error: '汉字、拼音、含义和年龄段ID不能为空' })
    }

    // 如果没有提供音频URL，自动生成
    let finalAudioUrl = audioUrl
    if (!finalAudioUrl) {
      finalAudioUrl = await generateAudioUrl(character)
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        character,
        pinyin,
        meaning,
        imageUrl,
        audioUrl: finalAudioUrl,
        ageGroupId
      },
      include: { ageGroup: true }
    })

    res.json(flashcard)
  } catch (error) {
    console.error('创建卡片失败:', error)
    res.status(500).json({ error: '创建卡片失败' })
  }
}

/**
 * 批量导入卡片
 * @param req 请求对象
 * @param res 响应对象
 */
export async function importFlashcards(req: Request, res: Response) {
  try {
    const { flashcards } = req.body

    if (!flashcards || !Array.isArray(flashcards)) {
      return res.status(400).json({ error: '请提供有效的卡片数据' })
    }

    // 处理音频URL
    const processedFlashcards = await Promise.all(
      flashcards.map(async (card: any) => {
        let finalAudioUrl = card.audioUrl
        if (!finalAudioUrl) {
          finalAudioUrl = await generateAudioUrl(card.character)
        }
        return {
          ...card,
          audioUrl: finalAudioUrl
        }
      })
    )

    const createdFlashcards = await prisma.flashcard.createMany({
      data: processedFlashcards,
      // skipDuplicates: true
    })

    res.json({ success: true, count: createdFlashcards.count })
  } catch (error) {
    console.error('批量导入卡片失败:', error)
    res.status(500).json({ error: '批量导入卡片失败' })
  }
}

/**
 * 获取所有年龄段
 * @param req 请求对象
 * @param res 响应对象
 */
export async function getAgeGroups(req: Request, res: Response) {
  try {
    const { userId } = req.query
    const ageGroups = await prisma.ageGroup.findMany({
      orderBy: { level: 'asc' },
      include: {
        flashcards: true
      }
    })

    // 如果提供了userId，计算每个年龄段的学习进度
    if (userId) {
      const ageGroupsWithProgress = await Promise.all(
        ageGroups.map(async (ageGroup) => {
          const totalCards = ageGroup.flashcards.length
          const learnedCards = await prisma.userProgress.count({
            where: {
              userId: parseInt(userId as string),
              isLearned: true,
              flashcard: {
                ageGroupId: ageGroup.id
              }
            }
          })

          return {
            ...ageGroup,
            progress: {
              total: totalCards,
              learned: learnedCards,
              percentage: totalCards > 0 ? (learnedCards / totalCards) * 100 : 0
            }
          }
        })
      )
      res.json(ageGroupsWithProgress)
    } else {
      // 没有提供userId，只返回年龄段信息
      res.json(ageGroups)
    }
  } catch (error) {
    console.error('获取年龄段失败:', error)
    res.status(500).json({ error: '获取年龄段失败' })
  }
}

/**
 * 获取所有汉字卡片
 * @param req 请求对象
 * @param res 响应对象
 */
export async function getAllFlashcards(_req: Request, res: Response) {
  try {
    const flashcards = await prisma.flashcard.findMany({
      include: { ageGroup: true }
    })
    res.json(flashcards)
  } catch (error) {
    console.error('获取所有汉字卡片失败:', error)
    res.status(500).json({ error: '获取所有汉字卡片失败' })
  }
}

/**
 * 获取指定年龄段的汉字
 * @param req 请求对象
 * @param res 响应对象
 */
export async function getFlashcardsByAgeGroup(req: Request, res: Response) {
  try {
    const { ageGroupId } = req.params
    const { userId } = req.query
    const flashcards = await prisma.flashcard.findMany({
      where: { ageGroupId: parseInt(ageGroupId) },
      include: { ageGroup: true }
    })

    // 如果提供了userId，标记已学习的卡片
    if (userId) {
      const learnedFlashcardIds = await prisma.userProgress.findMany({
        where: {
          userId: parseInt(userId as string),
          isLearned: true,
          flashcard: {
            ageGroupId: parseInt(ageGroupId)
          }
        },
        select: {
          flashcardId: true
        }
      })

      const learnedIds = learnedFlashcardIds.map(item => item.flashcardId)
      const flashcardsWithStatus = flashcards.map(card => ({
        ...card,
        isLearned: learnedIds.includes(card.id)
      }))

      res.json(flashcardsWithStatus)
    } else {
      // 没有提供userId，只返回卡片信息
      res.json(flashcards)
    }
  } catch (error) {
    console.error('获取汉字列表失败:', error)
    res.status(500).json({ error: '获取汉字列表失败' })
  }
}

/**
 * 获取汉字详情
 * @param req 请求对象
 * @param res 响应对象
 */
export async function getFlashcardById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { userId } = req.query
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: parseInt(id) },
      include: { ageGroup: true }
    })

    if (flashcard) {
      // 如果提供了userId，检查是否已学习
      if (userId) {
        const progress = await prisma.userProgress.findFirst({
          where: {
            userId: parseInt(userId as string),
            flashcardId: parseInt(id)
          }
        })

        res.json({
          ...flashcard,
          isLearned: progress?.isLearned || false
        })
      } else {
        res.json(flashcard)
      }
    } else {
      res.status(404).json({ error: '汉字不存在' })
    }
  } catch (error) {
    console.error('获取汉字详情失败:', error)
    res.status(500).json({ error: '获取汉字详情失败' })
  }
}
