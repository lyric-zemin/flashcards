import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { checkAndGrantSignInBadges } from './achievementController'

const prisma = new PrismaClient()

/**
 * 积分和奖励系统控制器
 */

/**
 * 获取用户积分记录
 * @param req 请求对象
 * @param res 响应对象
 */
export async function getUserPoints(req: Request, res: Response) {
  try {
    const { userId } = req

    if (!userId) {
      return res.status(401).json({ error: '用户未登录' })
    }

    const records = await prisma.pointRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    // 计算总积分
    const totalPoints = records.reduce((sum, record) => sum + record.points, 0)

    res.json({ totalPoints, records })
  } catch (error) {
    console.error('获取用户积分记录失败:', error)
    res.status(500).json({ error: '获取用户积分记录失败' })
  }
}

/**
 * 增加用户积分
 * @param req 请求对象
 * @param res 响应对象
 */
export async function addUserPoints(req: Request, res: Response) {
  try {
    const { userId } = req
    const { points, type, description } = req.body

    if (!userId) {
      return res.status(401).json({ error: '用户未登录' })
    }

    if (!points || !type) {
      return res.status(400).json({ error: '积分数量和类型不能为空' })
    }

    const record = await prisma.pointRecord.create({
      data: {
        userId,
        points,
        type,
        description
      }
    })

    // 检查是否达成成就
    await checkAchievements(userId)

    res.json(record)
  } catch (error) {
    console.error('增加用户积分失败:', error)
    res.status(500).json({ error: '增加用户积分失败' })
  }
}

/**
 * 用户签到
 * @param req 请求对象
 * @param res 响应对象
 */
export async function userSignIn(req: Request, res: Response) {
  try {
    const { userId } = req

    if (!userId) {
      return res.status(401).json({ error: '用户未登录' })
    }

    // 检查今天是否已经签到
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingSignIn = await prisma.signIn.findFirst({
      where: {
        userId,
        signInDate: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    if (existingSignIn) {
      return res.status(400).json({ error: '今天已经签到过了' })
    }

    // 计算连续签到天数
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const yesterdaySignIn = await prisma.signIn.findFirst({
      where: {
        userId,
        signInDate: {
          gte: yesterday,
          lt: today
        }
      }
    })

    let consecutiveDays = 1
    if (yesterdaySignIn) {
      // 查询最近的签到记录，计算连续天数
      const signIns = await prisma.signIn.findMany({
        where: { userId },
        orderBy: { signInDate: 'desc' }
      })

      consecutiveDays = 1
      for (let i = 0; i < signIns.length - 1; i++) {
        const currentDate = new Date(signIns[i].signInDate)
        currentDate.setHours(0, 0, 0, 0)

        const nextDate = new Date(signIns[i + 1].signInDate)
        nextDate.setHours(0, 0, 0, 0)

        const dayDiff = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24))

        if (dayDiff === 1) {
          consecutiveDays++
        } else {
          break
        }
      }
    }

    // 创建签到记录
    const signIn = await prisma.signIn.create({
      data: {
        userId,
        signInDate: new Date()
      }
    })

    // 签到奖励积分
    let signInPoints = 10
    if (consecutiveDays >= 7) {
      signInPoints = 50
    } else if (consecutiveDays >= 3) {
      signInPoints = 30
    }

    await prisma.pointRecord.create({
      data: {
        userId,
        points: signInPoints,
        type: 'sign_in',
        description: `签到奖励${consecutiveDays}天`
      }
    })

    // 检查是否达成成就
    await checkAchievements(userId)

    // 检查并授予签到徽章
    await checkAndGrantSignInBadges(userId, consecutiveDays)

    res.json({ signIn, consecutiveDays, signInPoints })
  } catch (error) {
    console.error('用户签到失败:', error)
    res.status(500).json({ error: '用户签到失败' })
  }
}

/**
 * 检查用户是否达成成就
 * @param userId 用户ID
 */
async function checkAchievements(userId: number) {
  try {
    // 获取用户总积分
    const records = await prisma.pointRecord.findMany({ where: { userId } })
    const totalPoints = records.reduce((sum, record) => sum + record.points, 0)

    // 获取所有成就
    const achievements = await prisma.achievement.findMany()

    for (const achievement of achievements) {
      // 检查是否已经达成
      const existingAchievement = await prisma.userAchievement.findFirst({
        where: {
          userId,
          achievementId: achievement.id
        }
      })

      // 如果未达成且积分达到要求，标记为达成
      if (!existingAchievement && totalPoints >= achievement.requiredPoints) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id
          }
        })
      }
    }
  } catch (error) {
    console.error('检查成就失败:', error)
  }
}
