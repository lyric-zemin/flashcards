/**
 * 游戏工具函数
 * 提供游戏中使用的通用方法
 */

/**
 * 打乱数组顺序
 * @param array 要打乱的数组
 * @returns 打乱后的新数组
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * 生成指定范围内的随机数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 随机数
 */
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 从数组中随机选择指定数量的元素
 * @param array 源数组
 * @param count 要选择的元素数量
 * @returns 随机选择的元素数组
 */
export function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = shuffleArray(array)
  return shuffled.slice(0, count)
}

/**
 * 生成选项（用于选择题）
 * @param correct 正确答案
 * @param allOptions 所有可能的选项
 * @param count 选项数量
 * @returns 包含正确答案的选项数组
 */
export function generateOptions(correct: string, allOptions: string[], count: number = 4): string[] {
  const options = [correct]
  while (options.length < count) {
    const randomOption = allOptions[Math.floor(Math.random() * allOptions.length)]
    if (!options.includes(randomOption)) {
      options.push(randomOption)
    }
  }
  return shuffleArray(options)
}
