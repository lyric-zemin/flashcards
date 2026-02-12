import express from 'express'
import {
  getUserInfo,
  updateUserInfo,
  getUserProgress,
  updateLearningProgress,
  getProgressByAgeGroup,
  getProgressStatistics
} from '../controllers/userController'

const router = express.Router()

// 获取用户信息
router.get('/info', getUserInfo)

// 更新用户信息
router.put('/info', updateUserInfo)

// 获取用户学习进度
router.get('/progress', getUserProgress)

// 按年龄组获取学习进度
router.get('/progress/age-group', getProgressByAgeGroup)

// 获取学习进度统计
router.get('/progress/statistics', getProgressStatistics)

// 更新学习进度
router.put('/progress/:flashcardId', updateLearningProgress)

export default router
