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
router.get('/points', getUserPoints)
router.post('/points', addUserPoints)
router.post('/signin', userSignIn)

// 成就相关路由
router.get('/achievements', getAllAchievements)
router.get('/users/achievements', getUserAchievements)

// 徽章相关路由
router.get('/badges', getAllBadges)
router.get('/users/badges', getUserBadges)
router.post('/users/badges/:badgeId', grantUserBadge)

export default router
