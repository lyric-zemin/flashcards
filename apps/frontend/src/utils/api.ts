/**
 * API工具函数
 * 用于处理与后端的API调用
 */

import axios from 'axios'

// 类型定义
export interface AgeGroup {
  id: number
  name: string
  level: number
}

export interface Flashcard {
  id: number
  character: string
  pinyin: string
  meaning: string
  imageUrl: string
  audioUrl: string
  ageGroupId: number
  ageGroup?: AgeGroup
}

export interface User {
  id: number
  username: string
  nickname: string
  avatar: string | null
  createdAt: string
  updatedAt: string
}

export interface UserPoints {
  totalPoints: number
  records: Array<{
    id: number
    userId: number
    points: number
    type: string
    description: string
    createdAt: string
  }>
}

export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  requiredPoints: number
}

export interface UserAchievement {
  id: number
  userId: number
  achievementId: number
  achievedAt: string
  achievement: Achievement
}

export interface Badge {
  id: number
  name: string
  description: string
  icon: string
  condition: string
}

export interface UserBadge {
  id: number
  userId: number
  badgeId: number
  obtainedAt: string
  badge: Badge
}

export interface SignInResult {
  success: boolean
  message: string
  points?: number
  consecutiveDays?: number
  signInPoints?: number
}

export interface AddPointsResult {
  success: boolean
  totalPoints: number
  addedPoints: number
}

export interface LoginResult {
  success: boolean
  user: User
  token?: string
}

export interface RegisterResult {
  success: boolean
  user: User
  token?: string
}

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 可以在这里添加认证token等
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.error('响应错误:', error)
    // 统一错误处理
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 400:
          console.error('请求参数错误:', error.response.data)
          break
        case 401:
          console.error('未授权，请重新登录:', error.response.data)
          // 可以在这里处理登录过期逻辑
          break
        case 403:
          console.error('拒绝访问:', error.response.data)
          break
        case 404:
          console.error('请求地址不存在:', error.response.config.url)
          break
        case 500:
          console.error('服务器内部错误:', error.response.data)
          break
        default:
          console.error(`请求失败: ${error.response.status}`, error.response.data)
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误，无法连接到服务器:', error.request)
    } else {
      // 请求配置错误
      console.error('请求配置错误:', error.message)
    }
    return Promise.reject(error)
  }
)

/**
 * 获取用户积分
 * @param userId 用户ID
 * @returns 用户积分和积分记录
 */
export const getUserPoints = async (userId: number): Promise<UserPoints> => {
  const response = await api.get(`/gamification/users/${userId}/points`)
  return response.data
}

/**
 * 增加用户积分
 * @param userId 用户ID
 * @param points 增加的积分
 * @param type 积分类型
 * @param description 积分描述
 * @returns 操作结果
 */
export const addUserPoints = async (userId: number, points: number, type: string, description: string): Promise<AddPointsResult> => {
  const response = await api.post(`/gamification/users/${userId}/points`, {
    points,
    type,
    description
  })
  return response.data
}

/**
 * 用户签到
 * @param userId 用户ID
 * @returns 签到结果
 */
export const userSignIn = async (userId: number): Promise<SignInResult> => {
  const response = await api.post(`/gamification/users/${userId}/signin`)
  return response.data
}

/**
 * 获取所有年龄段
 * @returns 年龄段列表
 */
export const getAgeGroups = async (): Promise<AgeGroup[]> => {
  const response = await api.get('/age-groups')
  return response.data
}

/**
 * 获取指定年龄段的汉字卡片
 * @param ageGroupId 年龄段ID
 * @returns 汉字卡片列表
 */
export const getFlashcardsByAgeGroup = async (ageGroupId: number): Promise<Flashcard[]> => {
  const response = await api.get(`/flashcards/${ageGroupId}`)
  return response.data
}

/**
 * 获取所有汉字卡片
 * @returns 所有汉字卡片
 */
export const getAllFlashcards = async (): Promise<Flashcard[]> => {
  const response = await api.get('/flashcards')
  return response.data
}

/**
 * 获取单个汉字卡片详情
 * @param id 汉字卡片ID
 * @returns 汉字卡片详情
 */
export const getFlashcardById = async (id: number): Promise<Flashcard> => {
  const response = await api.get(`/flashcard/${id}`)
  return response.data
}

/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 * @returns 登录结果
 */
export const login = async (username: string, password: string): Promise<LoginResult> => {
  const response = await api.post('/auth/login', {
    username,
    password
  })
  return response.data
}

/**
 * 用户注册
 * @param username 用户名
 * @param nickname 昵称
 * @param password 密码
 * @returns 注册结果
 */
export const register = async (username: string, nickname: string, password: string): Promise<RegisterResult> => {
  const response = await api.post('/auth/register', {
    username,
    nickname,
    password
  })
  return response.data
}

/**
 * 获取用户信息
 * @param userId 用户ID
 * @returns 用户信息
 */
export const getUserInfo = async (userId: number): Promise<User> => {
  const response = await api.get(`/gamification/users/${userId}`)
  return response.data
}

/**
 * 获取用户成就
 * @param userId 用户ID
 * @returns 用户成就列表
 */
export const getUserAchievements = async (userId: number): Promise<UserAchievement[]> => {
  const response = await api.get(`/gamification/users/${userId}/achievements`)
  return response.data
}

/**
 * 获取用户徽章
 * @param userId 用户ID
 * @returns 用户徽章列表
 */
export const getUserBadges = async (userId: number): Promise<UserBadge[]> => {
  const response = await api.get(`/gamification/users/${userId}/badges`)
  return response.data
}

export default api
