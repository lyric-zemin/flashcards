import React from 'react'

interface GameCardProps {
  id: string
  name: string
  description: string
  icon: string
  color: string
  onClick: (gameMode: string) => void
}

/**
 * 游戏卡片组件
 * 展示游戏卡片，包含游戏名称、描述和图标
 */
const GameCard: React.FC<GameCardProps> = ({
  id,
  name,
  description,
  icon,
  color,
  onClick
}) => {
  return (
    <div 
      key={id} 
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer"
      onClick={() => onClick(name)}
    >
      <div className={`${color} text-white p-6 flex items-center justify-center`}>
        <div className="text-5xl">{icon}</div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-dark mb-2">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

export default GameCard
