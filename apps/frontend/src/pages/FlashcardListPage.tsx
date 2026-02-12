import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { type Flashcard, getFlashcardsByAgeGroup } from '../utils/api'

/**
 * 文字列表页组件
 */
const FlashcardListPage: React.FC = () => {
  const { ageGroupId } = useParams<{ ageGroupId: string }>()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [ageGroupName, setAgeGroupName] = useState('')
  const navigate = useNavigate()

  /**
   * 获取汉字列表数据
   */
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const data = await getFlashcardsByAgeGroup(Number(ageGroupId))
        setFlashcards(data)
        if (data.length > 0) {
          setAgeGroupName(data[0].ageGroup?.name || '')
        }
      } catch (error) {
        console.error('获取汉字列表失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFlashcards()
  }, [ageGroupId])

  /**
   * 处理汉字点击，进入详情页
   * @param flashcardId 汉字ID
   */
  const handleFlashcardClick = (flashcardId: number) => {
    navigate(`/flashcard/${flashcardId}`)
  }

  /**
   * 返回首页
   */
  const handleBackToHome = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-light">
        <div className="text-2xl font-bold text-primary">加载中...</div>
      </div>
    )
  }

  return (
    <>
      {/* 头部 */}
      <Header 
        title={`${ageGroupName} 汉字`}
        showBackButton={true}
        onBackClick={handleBackToHome}
      />

      {/* 主要内容 */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {flashcards.map((card) => (
              <div 
                key={card.id} 
                className={`bg-white rounded-xl shadow-lg p-4 text-center cursor-pointer hover:transform hover:scale-105 transition-all duration-300 ${card.isLearned ? 'border-2 border-green-500' : ''}`}
                onClick={() => handleFlashcardClick(card.id)}
              >
                <div className="relative">
                  <div className="text-4xl font-bold text-primary mb-2">{card.character}</div>
                  {card.isLearned && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </div>
                <div className="text-gray-500 mb-1">{card.pinyin}</div>
                <div className="text-sm text-gray-600">{card.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default FlashcardListPage
