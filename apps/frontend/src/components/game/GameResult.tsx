import React from 'react'

interface GameResultProps {
  score: number
  time: number
  correctCount: number
  totalCount: number
  points?: number
  onRetry: () => void
  onBack: () => void
}

/**
 * 游戏结果组件
 * 展示游戏结果，包含得分、用时等信息
 */
const GameResult: React.FC<GameResultProps> = ({
  score,
  time,
  correctCount,
  totalCount,
  points,
  onRetry,
  onBack
}) => {
  // 计算正确率
  const accuracy = Math.round((correctCount / totalCount) * 100)

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-primary mb-6">游戏结束！</h2>
      
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center p-4 bg-light rounded-lg">
          <span className="text-lg font-medium text-dark">得分</span>
          <span className="text-2xl font-bold text-primary">{score}</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-light rounded-lg">
          <span className="text-lg font-medium text-dark">用时</span>
          <span className="text-2xl font-bold text-primary">{time} 秒</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-light rounded-lg">
          <span className="text-lg font-medium text-dark">正确率</span>
          <span className="text-2xl font-bold text-primary">{accuracy}%</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-light rounded-lg">
          <span className="text-lg font-medium text-dark">答对/总题数</span>
          <span className="text-2xl font-bold text-primary">{correctCount}/{totalCount}</span>
        </div>
        
        {points !== undefined && (
          <div className="flex justify-between items-center p-4 bg-yellow-100 rounded-lg">
            <span className="text-lg font-medium text-dark">获得积分</span>
            <span className="text-2xl font-bold text-yellow-600">+{points}</span>
          </div>
        )}
      </div>
      
      <div className="flex space-x-4 justify-center">
        <button
          className="bg-primary text-white px-8 py-3 rounded-lg font-bold @hover:bg-opacity-90 transition-colors"
          onClick={onRetry}
        >
          再玩一次
        </button>
        <button
          className="bg-gray-500 text-white px-8 py-3 rounded-lg font-bold @hover:bg-gray-600 transition-colors"
          onClick={onBack}
        >
          返回游戏列表
        </button>
      </div>
    </div>
  )
}

export default GameResult
