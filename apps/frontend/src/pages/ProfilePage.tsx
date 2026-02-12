import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { animateNumber } from '../components/animations'
import { type User, type UserPoints, type UserAchievement, type UserBadge, getUserInfo, getUserPoints, getUserAchievements, getUserBadges, userSignIn, getUserId } from '../utils/api'

/**
 * 个人中心页面
 */
const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [points, setPoints] = useState<UserPoints>({ totalPoints: 0, records: [] })
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const pointsRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // 检查用户登录状态
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      navigate('/login')
    }
  }, [navigate])

  const userId = getUserId()

  /**
   * 获取用户信息
   */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 获取用户信息
        const userData = await getUserInfo()
        setUser(userData)

        // 获取用户积分
        const pointsData = await getUserPoints()
        setPoints(pointsData)

        // 获取用户成就
        const achievementsData = await getUserAchievements()
        setAchievements(achievementsData)

        // 获取用户徽章
        const badgesData = await getUserBadges()
        setBadges(badgesData)
      } catch (error) {
        console.error('获取用户数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  // 当积分数据更新时，执行数字增长动画
  useEffect(() => {
    if (!loading && pointsRef.current) {
      animateNumber(pointsRef.current, 0, points.totalPoints, 1500)
    }
  }, [points.totalPoints, loading])

  /**
   * 处理签到
   */
  const handleSignIn = async () => {
    try {
      setIsSigningIn(true)
      const response = await userSignIn()
      
      // 更新积分
      const pointsData = await getUserPoints()
      setPoints(pointsData)

      alert(`签到成功！获得 ${response.signInPoints} 积分，连续签到 ${response.consecutiveDays} 天`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('签到失败:', error)
      alert(error.response?.data?.error || '签到失败，请稍后再试')
    } finally {
      setIsSigningIn(false)
    }
  }

  /**
   * 返回首页
   */
  const handleBackToHome = () => {
    navigate('/')
  }

  /**
   * 退出登录
   */
  const handleLogout = () => {
    // 显示确认对话框
    const confirmLogout = window.confirm('确定要退出登录吗？')
    
    // 如果用户确认，执行退出登录逻辑
    if (confirmLogout) {
      // 清除localStorage中的用户信息和登录状态
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
      // 重定向到登录页面
      navigate('/login')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-light">
        <div className="text-2xl font-bold text-primary">加载中...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-light">
        <div className="text-2xl font-bold text-primary">用户不存在</div>
      </div>
    )
  }

  return (
    <>
      {/* 头部 */}
      <Header 
        title="个人中心"
        showBackButton={true}
        onBackClick={handleBackToHome}
      />

      {/* 主要内容 */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* 用户信息卡片 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl sm:text-4xl font-bold mr-4 sm:mr-6">
                  {user.nickname.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-dark truncate">{user.nickname}</h2>
                  <p className="text-gray-500 whitespace-nowrap">注册时间: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button 
                className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors text-sm sm:text-base whitespace-nowrap"
                onClick={handleLogout}
              >
                退出登录
              </button>
            </div>
          </div>

          {/* 签到卡片 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-dark mb-4">每日签到</h3>
            <button 
              className={`bg-secondary text-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors ${isSigningIn ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={handleSignIn}
              disabled={isSigningIn}
            >
              {isSigningIn ? '签到中...' : '立即签到'}
            </button>
            <p className="text-gray-500 mt-2">签到可以获得积分奖励，连续签到奖励更丰厚！</p>
          </div>

          {/* 积分卡片 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-dark mb-4">我的积分</h3>
            <div ref={pointsRef} className="text-4xl font-bold text-primary mb-4">{points.totalPoints}</div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {points.records.slice(0, 5).map((record) => (
                <div key={record.id} className="flex justify-between items-center p-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">{record.description}</p>
                    <p className="text-sm text-gray-500">{new Date(record.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-green-500 font-bold">+{record.points}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 成就卡片 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-dark mb-4">我的成就</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {achievements.map((userAchievement) => (
                <div key={userAchievement.id} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">{userAchievement.achievement.icon}</div>
                  <h4 className="font-bold text-dark">{userAchievement.achievement.name}</h4>
                  <p className="text-sm text-gray-500">{userAchievement.achievement.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(userAchievement.achievedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            {achievements.length === 0 && (
              <p className="text-gray-500 text-center py-8">还没有获得任何成就，继续努力！</p>
            )}
          </div>

          {/* 徽章卡片 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-dark mb-4">我的徽章</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {badges.map((userBadge) => (
                <div key={userBadge.id} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">{userBadge.badge.icon}</div>
                  <h4 className="font-bold text-dark">{userBadge.badge.name}</h4>
                  <p className="text-sm text-gray-500">{userBadge.badge.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(userBadge.obtainedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            {badges.length === 0 && (
              <p className="text-gray-500 text-center py-8">还没有获得任何徽章，继续努力！</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
