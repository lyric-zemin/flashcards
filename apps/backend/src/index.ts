import express from 'express'
import cors from 'cors'
import flashcardRoutes from './routes/flashcardRoutes'
import gamificationRoutes from './routes/gamificationRoutes'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

// 路由
app.use('/api', flashcardRoutes)
app.use('/api/gamification', gamificationRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// 静态文件服务
app.use('/static', express.static('public'))

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})
