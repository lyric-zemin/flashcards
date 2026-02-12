import { Request, Response, NextFunction } from 'express'

/**
 * 用户ID中间件
 * 从请求头中获取用户ID并添加到请求对象中
 */
export const userIdMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  // 从请求头中获取用户ID
  const userIdHeader = req.header('X-User-Id')
  let userId: number | undefined

  // 处理用户ID
  if (userIdHeader) {
    const parsedUserId = parseInt(userIdHeader, 10)
    if (!isNaN(parsedUserId)) {
      userId = parsedUserId
    }
  }

  // 将用户ID添加到请求对象中
  (req as any).userId = userId

  // 继续处理请求
  next()
}

// 扩展Express Request接口，添加userId属性
declare global {
  namespace Express {
    interface Request {
      userId?: number
    }
  }
}
