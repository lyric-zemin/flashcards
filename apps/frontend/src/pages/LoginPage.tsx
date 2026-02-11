import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import { login } from '../utils/api'

/**
 * 登录页面组件
 */
const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  /**
   * 处理表单提交
   * @param e 表单事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 调用登录API
      const response = await login(username, password)

      // 存储用户信息到localStorage
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('isLoggedIn', 'true')

      // 登录成功后跳转到个人中心
      navigate('/profile')
    } catch (err: any) {
      // 处理登录失败的情况
      if (err.response) {
        setError(err.response.data.error || '登录失败，请检查用户名和密码')
      } else {
        setError('网络错误，请稍后再试')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* 头部 */}
      <Header 
        title="登录"
      />

      {/* 主要内容 */}
      <div className="flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-dark mb-6 text-center">欢迎回来</h2>
            
            {/* 错误提示 */}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* 登录表单 */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入用户名"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  密码
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入密码"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? '登录中...' : '登录'}
              </button>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  还没有账号？ <Link to="/register" className="text-primary font-bold">立即注册</Link>
                </p>
              </div>
            </form>

            {/* 测试账号提示 */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-bold text-yellow-800 mb-2">测试账号</h3>
              <p className="text-yellow-700">用户名: test</p>
              <p className="text-yellow-700">密码: password123</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
