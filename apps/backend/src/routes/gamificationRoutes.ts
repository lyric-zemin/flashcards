import express from 'express'
import {
  createOrGetUser,
  getUserInfo,
  updateUserInfo,
  getUserProgress,
  updateLearningProgress
} from '../controllers/userController'
import {
  getUserPoints,
  addUserPoints,
  userSignIn
} from '../controllers/pointController'
import {
  getAllAchievements,
  getUserAchievements,
  getAllBadges,
  getUserBadges,
  grantUserBadge
} from '../controllers/achievementController'

const router = express.Router()

// 用户相关路由
router.post('/users', createOrGetUser)
router.get('/users/:userId', getUserInfo)
router.put('/users/:userId', updateUserInfo)
router.get('/users/:userId/progress', getUserProgress)
router.put('/users/:userId/progress/:flashcardId', updateLearningProgress)

// 积分相关路由
router.get('/users/:userId/points', getUserPoints)
router.post('/users/:userId/points', addUserPoints)
router.post('/users/:userId/signin', userSignIn)

// 成就相关路由
router.get('/achievements', getAllAchievements)
router.get('/users/:userId/achievements', getUserAchievements)

// 徽章相关路由
router.get('/badges', getAllBadges)
router.get('/users/:userId/badges', getUserBadges)
router.post('/users/:userId/badges/:badgeId', grantUserBadge)

export default router
