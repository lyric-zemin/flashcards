import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * 获取所有年龄段
 * @param req 请求对象
 * @param res 响应对象
 */
export async function getAgeGroups(_req: Request, res: Response) {
  try {
    const ageGroups = await prisma.ageGroup.findMany({
      orderBy: { level: 'asc' }
    })
    res.json(ageGroups)
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
    const flashcards = await prisma.flashcard.findMany({
      where: { ageGroupId: parseInt(ageGroupId) },
      include: { ageGroup: true }
    })
    res.json(flashcards)
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
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: parseInt(id) },
      include: { ageGroup: true }
    })
    if (flashcard) {
      res.json(flashcard)
    } else {
      res.status(404).json({ error: '汉字不存在' })
    }
  } catch (error) {
    console.error('获取汉字详情失败:', error)
    res.status(500).json({ error: '获取汉字详情失败' })
  }
}
