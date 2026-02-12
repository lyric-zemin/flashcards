import express from 'express'
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
