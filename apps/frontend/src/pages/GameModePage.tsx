import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

/**
 * 游戏化学习模式页面
 */
const GameModePage: React.FC = () => {
  const navigate = useNavigate()

  /**
   * 处理游戏模式选择
   * @param gameMode 游戏模式
   */
  const handleGameModeSelect = (gameMode: string) => {
    // 根据不同的游戏模式导航到不同的游戏页面
    console.log(`选择了游戏模式: ${gameMode}`)
    
    // 导航到对应的游戏页面
    switch(gameMode) {
      case '汉字配对':
        navigate('/games/matching');
        break;
      case '汉字拼图':
        navigate('/games/puzzle');
        break;
      case '记忆挑战':
        navigate('/games/memory');
        break;
      case '汉字小测验':
        navigate('/games/quiz');
        break;
      case '汉字连连看':
        navigate('/games/connect');
        break;
      case '汉字填空':
        navigate('/games/fill');
        break;
      default:
        break;
    }
  }

  /**
   * 返回首页
   */
  const handleBackToHome = () => {
    navigate('/')
  }

  // 游戏模式列表
  const gameModes = [
    {
      id: 'matching',
      name: '汉字配对',
      description: '将汉字与对应的图片进行配对',
      icon: '🔄',
      color: 'bg-primary'
    },
    {
      id: 'puzzle',
      name: '汉字拼图',
      description: '将汉字拆解成笔画进行拼图',
      icon: '🧩',
      color: 'bg-secondary'
    },
    {
      id: 'memory',
      name: '记忆挑战',
      description: '限时记忆汉字并回答问题',
      icon: '🧠',
      color: 'bg-accent'
    },
    {
      id: 'quiz',
      name: '汉字小测验',
      description: '测试你对汉字的掌握程度',
      icon: '📝',
      color: 'bg-green-500'
    },
    {
      id: 'connect',
      name: '汉字连连看',
      description: '连接相同的汉字进行消除',
      icon: '🔗',
      color: 'bg-blue-500'
    },
    {
      id: 'fill',
      name: '汉字填空',
      description: '根据图片和拼音填写正确的汉字',
      icon: '✏️',
      color: 'bg-purple-500'
    }
  ]

  return (
    <>
      {/* 头部 */}
      <Header 
        title="游戏化学习"
        showBackButton={true}
        onBackClick={handleBackToHome}
      />

      {/* 主要内容 */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl font-bold text-dark mb-4">选择游戏模式</h2>
            <p className="text-gray-600">通过有趣的游戏方式学习汉字，提高学习效率！</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gameModes.map((mode) => (
              <div 
                key={mode.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 @hover:scale-105 cursor-pointer @hover:shadow-xl"
                onClick={() => handleGameModeSelect(mode.name)}
              >
                <div className={`${mode.color} text-white p-6 flex items-center justify-center`}>
                  <div className="text-5xl transform transition-transform duration-300 @hover:scale-110">{mode.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-dark mb-2">{mode.name}</h3>
                  <p className="text-gray-600">{mode.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default GameModePage
