import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { type AgeGroup, getAgeGroups } from '../utils/api'

/**
 * 首页组件 - 年龄段选择
 */
const HomePage: React.FC = () => {
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  /**
   * 获取年龄段数据
   */
  useEffect(() => {
    const fetchAgeGroups = async () => {
      try {
        const data = await getAgeGroups()
        setAgeGroups(data)
      } catch (error) {
        console.error('获取年龄段失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAgeGroups()
  }, [])

  /**
   * 处理年龄段选择
   * @param ageGroupId 年龄段ID
   */
  const handleAgeGroupSelect = (ageGroupId: number) => {
    navigate(`/flashcards/${ageGroupId}`)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-light">
        <div className="text-2xl font-bold text-primary">加载中...</div>
      </div>
    )
  }

  // 检查用户登录状态
  // const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  // const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null

  return (
    <>
      {/* 头部 */}
      <Header 
        title="汉字启蒙" 
        showAuthButtons={true}
      />
      <p className="text-center mt-2 text-dark mb-6">选择适合孩子的年龄段</p>

      {/* 主要内容 */}
      <div className="flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          {/* 年龄段选择 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-dark mb-6 text-center">选择年龄段</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ageGroups.map((group) => (
                <div 
                  key={group.id} 
                  className="bg-white rounded-xl shadow-lg p-8 text-center cursor-pointer hover:transform hover:scale-105 transition-all duration-300"
                  onClick={() => handleAgeGroupSelect(group.id)}
                >
                  <div className="text-6xl font-bold text-primary mb-4">{group.level}</div>
                  <h3 className="text-2xl font-bold text-dark mb-2">{group.name}</h3>
                  <p className="text-gray-500">适合 {group.name} 的孩子</p>
                </div>
              ))}
            </div>
          </div>

          {/* 游戏化学习入口 */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-dark mb-6">游戏化学习</h2>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center cursor-pointer hover:transform hover:scale-105 transition-all duration-300 inline-block"
                 onClick={() => navigate('/games')}>
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold text-dark mb-2">开始游戏学习</h3>
              <p className="text-gray-500">通过有趣的游戏方式学习汉字</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage
