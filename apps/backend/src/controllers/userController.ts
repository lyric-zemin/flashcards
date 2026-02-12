import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

/**
 * 用户控制器
 */

/**
 * 创建或获取用户
 * @param req 请求对象
 * @param res 响应对象
 */
export async function createOrGetUser(req: Request, res: Response) {
  try {
    const { username, nickname, avatar } = req.body

    if (!username || !nickname) {
      return res.status(400).json({ error: '用户名和昵称不能为空' })
    }

    // 查找用户
    let user = await prisma.user.findUnique({
      where: { username }
    })

    // 如果用户不存在，创建新用户
    if (!user) {
      // 生成默认密码并进行哈希处理
      const defaultPassword = '123456' // 默认密码
      const hashedPassword = await bcrypt.hash(defaultPassword, 10)
      
      user = await prisma.user.create({
        data: {
          username,
          nickname,
          avatar,
          password: hashedPassword
        }
      })
    }

    res.json(user)
  } catch (error) {
    console.error('创建或获取用户失败:', error)
    res.status(500).json({ error: '创建或获取用户失败' })
  }
}

/**
 * 获取用户信息
 * @param req 请求对象
 * @param res 响应对象
 */
export async function getUserInfo(req: Request, res: Response) {
  try {
    const { userId } = req

    if (!userId) {
      return res.status(401).json({ error: '用户未登录' })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }

    res.json(user)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    res.status(500).json({ error: '获取用户信息失败' })
  }
}

/**
 * 更新用户信息
 * @param req 请求对象
 * @param res 响应对象
 */
export async function updateUserInfo(req: Request, res: Response) {
  try {
    const { userId } = req
    const { nickname, avatar } = req.body

    if (!userId) {
      return res.status(401).json({ error: '用户未登录' })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        nickname,
        avatar
      }
    })

    res.json(user)
  } catch (error) {
    console.error('更新用户信息失败:', error)
    res.status(500).json({ error: '更新用户信息失败' })
  }
}

/**
 * 获取用户学习进度
 * @param req 请求对象
 * @param res 响应对象
 */
export async function getUserProgress(req: Request, res: Response) {
  try {
    const { userId } = req

    if (!userId) {
      return res.status(401).json({ error: '用户未登录' })
    }

    const progress = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        flashcard: {
          include: {
            ageGroup: true
          }
        }
      }
    })

    res.json(progress)
  } catch (error) {
    console.error('获取用户学习进度失败:', error)
    res.status(500).json({ error: '获取用户学习进度失败' })
  }
}

/**
 * 更新学习进度
 * @param req 请求对象
 * @param res 响应对象
 */
export async function updateLearningProgress(req: Request, res: Response) {
  try {
    const { userId } = req
    const { flashcardId } = req.params
    const { isLearned } = req.body

    if (!userId) {
      return res.status(401).json({ error: '用户未登录' })
    }

    // 查找是否已有进度记录
    let progress = await prisma.userProgress.findFirst({
      where: {
        userId,
        flashcardId: parseInt(flashcardId)
      }
    })

    if (progress) {
      // 更新进度
      progress = await prisma.userProgress.update({
        where: { id: progress.id },
        data: {
          isLearned,
          learnedAt: isLearned ? new Date() : null
        }
      })
    } else {
      // 创建新进度记录
      progress = await prisma.userProgress.create({
        data: {
          userId,
          flashcardId: parseInt(flashcardId),
          isLearned,
          learnedAt: isLearned ? new Date() : null
        }
      })
    }

    res.json(progress)
  } catch (error) {
    console.error('更新学习进度失败:', error)
    res.status(500).json({ error: '更新学习进度失败' })
  }
}

/**
 * 按年龄组获取学习进度
 * @param req 请求对象
 * @param res 响应对象
 */
export async function getProgressByAgeGroup(req: Request, res: Response) {
  try {
    const { userId } = req

    if (!userId) {
      return res.status(401).json({ error: '用户未登录' })
    }

    const progress = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        flashcard: {
          include: {
            ageGroup: true
          }
        }
      }
    })

    // 按年龄组分组
    const progressByAgeGroup = progress.reduce((acc, item) => {
      const ageGroupName = item.flashcard.ageGroup.name
      if (!acc[ageGroupName]) {
        acc[ageGroupName] = []
      }
      acc[ageGroupName].push(item)
      return acc
    }, {} as Record<string, typeof progress>)

    res.json(progressByAgeGroup)
  } catch (error) {
    console.error('按年龄组获取学习进度失败:', error)
    res.status(500).json({ error: '按年龄组获取学习进度失败' })
  }
}

/**
 * 获取学习进度统计
 * @param req 请求对象
 * @param res 响应对象
 */
export async function getProgressStatistics(req: Request, res: Response) {
  try {
    const { userId } = req

    if (!userId) {
      return res.status(401).json({ error: '用户未登录' })
    }

    // 获取所有卡片数量
    const totalFlashcards = await prisma.flashcard.count()

    // 获取已学习卡片数量
    const learnedFlashcards = await prisma.userProgress.count({
      where: {
        userId,
        isLearned: true
      }
    })

    // 按年龄组统计
    const ageGroupStats = await prisma.ageGroup.findMany({
      include: {
        flashcards: true
      }
    })

    const statsByAgeGroup = await Promise.all(
      ageGroupStats.map(async (ageGroup) => {
        const ageGroupFlashcards = ageGroup.flashcards.length
        const learnedInAgeGroup = await prisma.userProgress.count({
          where: {
            userId,
            isLearned: true,
            flashcard: {
              ageGroupId: ageGroup.id
            }
          }
        })

        return {
          ageGroupId: ageGroup.id,
          ageGroupName: ageGroup.name,
          total: ageGroupFlashcards,
          learned: learnedInAgeGroup,
          progress: ageGroupFlashcards > 0 ? (learnedInAgeGroup / ageGroupFlashcards) * 100 : 0
        }
      })
    )

    const overallProgress = totalFlashcards > 0 ? (learnedFlashcards / totalFlashcards) * 100 : 0

    res.json({
      overall: {
        total: totalFlashcards,
        learned: learnedFlashcards,
        progress: overallProgress
      },
      byAgeGroup: statsByAgeGroup
    })
  } catch (error) {
    console.error('获取学习进度统计失败:', error)
    res.status(500).json({ error: '获取学习进度统计失败' })
  }
}
