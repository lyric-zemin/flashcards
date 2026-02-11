import React from 'react'
import { ScrollRestoration } from 'react-router-dom'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

/**
 * 通用Layout布局组件
 * 包含主要内容区域和Footer组件
 * 注意：不包含Header组件，Header将在每个页面中单独使用
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-light flex flex-col">
      <ScrollRestoration />
      {/* 主要内容区域 */}
      <main className="flex-grow">
        {children}
      </main>

      {/* 底部 */}
      <Footer />
    </div>
  )
}

export default Layout