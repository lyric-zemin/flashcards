import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import { register } from '../utils/api'

/**
 * 注册页面组件
 */
const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    // 表单验证
    if (!username || !nickname || !password || !confirmPassword) {
      setError('所有字段都不能为空')
      return
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setError('密码长度至少为6位')
      return
    }

    setLoading(true)

    try {
      // 调用注册API
      const response = await register(username, nickname, password)

      // 存储用户信息到localStorage
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('isLoggedIn', 'true')

      // 注册成功后跳转到个人中心
      navigate('/profile')
    } catch (err: any) {
      // 处理注册失败的情况
      if (err.response) {
        setError(err.response.data.error || '注册失败，请稍后再试')
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
        title="注册"
      />

      {/* 主要内容 */}
      <div className="flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-dark mb-6 text-center">创建新账号</h2>
            
            {/* 错误提示 */}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* 注册表单 */}
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

              <div className="mb-4">
                <label htmlFor="nickname" className="block text-gray-700 mb-2">
                  昵称
                </label>
                <input
                  type="text"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入昵称"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  密码
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入密码（至少6位）"
                  required
                  minLength={6}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                  确认密码
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请再次输入密码"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? '注册中...' : '注册'}
              </button>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  已有账号？ <Link to="/login" className="text-primary font-bold">立即登录</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage
