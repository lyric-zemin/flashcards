import React from 'react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  showBackButton?: boolean
  backButtonText?: string
  onBackClick?: () => void
  showAuthButtons?: boolean
  children?: React.ReactNode
}

/**
 * 通用Header组件
 * 使用sticky定位，支持响应式设计
 */
const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  backButtonText = '← 返回',
  onBackClick,
  showAuthButtons = false,
  children
}) => {
  const navigate = useNavigate()

  /**
   * 处理返回按钮点击
   */
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      navigate(-1)
    }
  }

  /**
   * 处理登录按钮点击
   */
  const handleLoginClick = () => {
    navigate('/login')
  }

  /**
   * 处理注册按钮点击
   */
  const handleRegisterClick = () => {
    navigate('/register')
  }

  /**
   * 处理个人中心按钮点击
   */
  const handleProfileClick = () => {
    navigate('/profile')
  }

  // 检查用户登录状态
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  return (
    <header className="bg-primary text-white py-4 px-3 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* 左侧：返回按钮 */}
          {showBackButton ? (
            <button
              className="bg-white text-primary px-3 py-2 rounded-lg font-bold @hover:bg-light transition-colors whitespace-nowrap"
              onClick={handleBackClick}
            >
              {backButtonText}
            </button>
          ) : (
            <div className="w-20"></div>
          )}

          {/* 中间：标题 */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center truncate max-w-[50%]">
            {title}
          </h1>

          {/* 右侧：认证按钮或占位 */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {showAuthButtons ? (
              isLoggedIn ? (
                <button
                  className="bg-white text-primary px-3 py-2 rounded-lg font-bold @hover:bg-light transition-colors whitespace-nowrap"
                  onClick={handleProfileClick}
                >
                  个人中心
                </button>
              ) : (
                <>
                  <button
                    className="bg-white text-primary px-3 py-2 rounded-lg font-bold @hover:bg-light transition-colors whitespace-nowrap"
                    onClick={handleLoginClick}
                  >
                    登录
                  </button>
                  <button
                    className="bg-white text-primary px-3 py-2 rounded-lg font-bold @hover:bg-light transition-colors whitespace-nowrap"
                    onClick={handleRegisterClick}
                  >
                    注册
                  </button>
                </>
              )
            ) : children ? (
              children
            ) : (
              <div className="w-20"></div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header