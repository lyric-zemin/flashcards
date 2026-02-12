import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

/**
 * 认证控制器
 */

/**
 * 用户注册
 * @param req 请求对象
 * @param res 响应对象
 */
export async function register(req: Request, res: Response) {
  try {
    const { username, nickname, password } = req.body

    if (!username || !nickname || !password) {
      return res.status(400).json({ error: '用户名、昵称和密码不能为空' })
    }

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在' })
    }

    // 密码哈希
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        nickname,
        password: hashedPassword
      }
    })

    // 隐藏密码字段
    const { password: _, ...userWithoutPassword } = user

    res.json({ user: userWithoutPassword, message: '注册成功' })
  } catch (error) {
    console.error('注册失败:', error)
    res.status(500).json({ error: '注册失败' })
  }
}

/**
 * 用户登录
 * @param req 请求对象
 * @param res 响应对象
 */
export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' })
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    // 隐藏密码字段
    const { password: _, ...userWithoutPassword } = user

    res.json({ user: userWithoutPassword, message: '登录成功' })
  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({ error: '登录失败' })
  }
}

/**
 * 用户登出
 * @param req 请求对象
 * @param res 响应对象
 */
export async function logout(_req: Request, res: Response) {
  try {
    // 前端负责清除登录状态，后端只需要返回成功消息
    res.json({ message: '登出成功' })
  } catch (error) {
    console.error('登出失败:', error)
    res.status(500).json({ error: '登出失败' })
  }
}
