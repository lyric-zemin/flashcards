import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * 成就和徽章系统控制器
 */

/**
 * 获取所有成就
 * @param req 请求对象
 * @param res 响应对象
 */
export async function getAllAchievements(_req: Request, res: Response) {
  try {
    const achievements = await prisma.achievement.findMany()
    res.json(achievements)
  } catch (error) {
    console.error('获取所有成就失败:', error)
    res.status(500).json({ error: '获取所有成就失败' })
  }
}

/**
 * 获取用户成就
 * @param req 请求对象
 * @param res 响应对象
 */
export async function getUserAchievements(req: Request, res: Response) {
  try {
    const { userId } = req

    if (!userId) {
      return res.status(401).json({ error: '用户未登录' })
    }

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true
      },
      orderBy: { achievedAt: 'desc' }
    })

    res.json(userAchievements)
  } catch (error) {
    console.error('获取用户成就失败:', error)
    res.status(500).json({ error: '获取用户成就失败' })
  }
}

/**
 * 获取所有徽章
 * @param req 请求对象
 * @param res 响应对象
 */
export async function getAllBadges(_req: Request, res: Response) {
  try {
    const badges = await prisma.badge.findMany()
    res.json(badges)
  } catch (error) {
    console.error('获取所有徽章失败:', error)
    res.status(500).json({ error: '获取所有徽章失败' })
  }
}

/**
 * 获取用户徽章
 * @param req 请求对象
 * @param res 响应对象
 */
export async function getUserBadges(req: Request, res: Response) {
  try {
    const { userId } = req

    if (!userId) {
      return res.status(401).json({ error: '用户未登录' })
    }

    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true
      },
      orderBy: { obtainedAt: 'desc' }
    })

    res.json(userBadges)
  } catch (error) {
    console.error('获取用户徽章失败:', error)
    res.status(500).json({ error: '获取用户徽章失败' })
  }
}

/**
 * 授予用户徽章
 * @param req 请求对象
 * @param res 响应对象
 */
export async function grantUserBadge(req: Request, res: Response) {
  try {
    const { userId } = req
    const { badgeId } = req.params

    if (!userId) {
      return res.status(401).json({ error: '用户未登录' })
    }

    // 检查用户是否已经拥有该徽章
    const existingBadge = await prisma.userBadge.findFirst({
      where: {
        userId,
        badgeId: parseInt(badgeId)
      }
    })

    if (existingBadge) {
      return res.status(400).json({ error: '用户已经拥有该徽章' })
    }

    const userBadge = await prisma.userBadge.create({
      data: {
        userId,
        badgeId: parseInt(badgeId)
      },
      include: {
        badge: true
      }
    })

    res.json(userBadge)
  } catch (error) {
    console.error('授予用户徽章失败:', error)
    res.status(500).json({ error: '授予用户徽章失败' })
  }
}

/**
 * 检查并授予学习徽章
 * @param userId 用户ID
 * @param learnedCount 已学习汉字数量
 */
export async function checkAndGrantLearningBadges(userId: number, learnedCount: number) {
  try {
    // 定义徽章条件
    const badgeConditions = [
      { name: '初学者', condition: 'learned_10', requiredCount: 10 },
      { name: '学习者', condition: 'learned_50', requiredCount: 50 },
      { name: '汉字达人', condition: 'learned_100', requiredCount: 100 }
    ]

    for (const condition of badgeConditions) {
      if (learnedCount >= condition.requiredCount) {
        // 查找对应的徽章
        const badge = await prisma.badge.findFirst({
          where: { condition: condition.condition }
        })

        if (badge) {
          // 检查用户是否已经拥有该徽章
          const existingBadge = await prisma.userBadge.findFirst({
            where: {
              userId,
              badgeId: badge.id
            }
          })

          if (!existingBadge) {
            await prisma.userBadge.create({
              data: {
                userId,
                badgeId: badge.id
              }
            })
          }
        }
      }
    }
  } catch (error) {
    console.error('检查并授予学习徽章失败:', error)
  }
}
