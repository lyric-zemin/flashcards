/**
 * 积分管理工具函数
 * 用于管理用户积分
 */

import { getUserPoints as fetchUserPoints, addUserPoints as addPoints, getUserId } from './api'

/**
 * 获取用户积分
 * @returns 用户积分
 */
export const getUserPoints = async (): Promise<number> => {
  const userId = getUserId()
  if (!userId) {
    return 0
  }

  try {
    const response = await fetchUserPoints()
    return response.totalPoints || 0
  } catch (error) {
    console.error('获取用户积分失败:', error)
    return 0
  }
}

/**
 * 增加用户积分
 * @param points 增加的积分
 * @param type 积分类型
 * @param description 积分描述
 * @returns 操作是否成功
 */
export const addUserPoints = async (points: number, type: string, description: string): Promise<boolean> => {
  const userId = getUserId()
  if (!userId) {
    return false
  }

  try {
    await addPoints(points, type, description)
    return true
  } catch (error) {
    console.error('增加用户积分失败:', error)
    return false
  }
}

/**
 * 游戏得分转换为积分
 * @param gameScore 游戏得分
 * @param gameMode 游戏模式
 * @returns 转换后的积分
 */
export const convertGameScoreToPoints = (gameScore: number, gameMode: string): number => {
  // 根据游戏模式和得分计算积分
  const baseMultiplier = {
    'matching': 0.5,
    'puzzle': 0.6,
    'memory': 0.7,
    'quiz': 0.8,
    'connect': 0.5,
    'fill': 0.6
  }
  
  const multiplier = baseMultiplier[gameMode as keyof typeof baseMultiplier] || 0.5
  const points = Math.floor(gameScore * multiplier)
  return Math.max(points, 1) // 至少1积分
}

/**
 * 保存游戏积分
 * @param gameScore 游戏得分
 * @param gameMode 游戏模式
 * @returns 转换后的积分
 */
export const saveGamePoints = async (gameScore: number, gameMode: string): Promise<number> => {
  const points = convertGameScoreToPoints(gameScore, gameMode)
  
  // 游戏模式名称映射
  const gameModeNames = {
    'matching': '汉字配对',
    'puzzle': '汉字拼图',
    'memory': '记忆挑战',
    'quiz': '汉字小测验',
    'connect': '汉字连连看',
    'fill': '汉字填空'
  }
  
  const gameModeName = gameModeNames[gameMode as keyof typeof gameModeNames] || gameMode
  await addUserPoints(points, 'game', `游戏得分: ${gameModeName}`)
  
  return points
}
