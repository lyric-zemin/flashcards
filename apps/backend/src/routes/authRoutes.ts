import express from 'express'
import {
  register,
  login,
  logout,
  getCurrentUser
} from '../controllers/authController'

const router = express.Router()

// 注册路由
router.post('/register', register)

// 登录路由
router.post('/login', login)

// 登出路由
router.post('/logout', logout)

// 获取当前用户信息路由
router.get('/user/:userId', getCurrentUser)

export default router
