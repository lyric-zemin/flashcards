import React from 'react'

interface DifficultySelectorProps {
  difficulty: 'easy' | 'medium' | 'hard'
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void
}

/**
 * 游戏难度选择组件
 * 让用户选择游戏难度
 */
const DifficultySelector: React.FC<DifficultySelectorProps> = ({ 
  difficulty, 
  onDifficultyChange 
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-dark mb-4">选择难度</h3>
      <div className="flex space-x-4">
        <button
          className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
            difficulty === 'easy'
              ? 'bg-green-500 text-white'
              : 'bg-white border-2 border-green-500 text-green-500 hover:bg-green-50'
          }`}
          onClick={() => onDifficultyChange('easy')}
        >
          简单
        </button>
        <button
          className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
            difficulty === 'medium'
              ? 'bg-blue-500 text-white'
              : 'bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50'
          }`}
          onClick={() => onDifficultyChange('medium')}
        >
          中等
        </button>
        <button
          className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
            difficulty === 'hard'
              ? 'bg-red-500 text-white'
              : 'bg-white border-2 border-red-500 text-red-500 hover:bg-red-50'
          }`}
          onClick={() => onDifficultyChange('hard')}
        >
          困难
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>简单: 更多提示，更少选项</p>
        <p>中等: 标准提示，标准选项</p>
        <p>困难: 更少提示，更多选项</p>
      </div>
    </div>
  )
}

export default DifficultySelector