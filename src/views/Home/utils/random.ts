/**
 * 浏览器端加密安全洗牌（无需指定抽取数量）
 * @param array 要洗牌的数组
 * @returns 洗牌后的新数组
 */
function cryptoRandomInt(maxExclusive: number): number {
    if (maxExclusive <= 0) {
        return 0
    }
    const maxUint32 = 0xFFFFFFFF
    const limit = maxUint32 - (maxUint32 % maxExclusive)
    const randomBuffer = new Uint32Array(1)
    let value = 0
    do {
        crypto.getRandomValues(randomBuffer)
        value = randomBuffer[0]
    } while (value >= limit)
    return value % maxExclusive
}

function shuffleBrowserCrypto<T>(array: T[]): T[] {
    const newArray = [...array]
    if (newArray.length <= 1)
        return newArray

    // 遍历数组，每轮生成一个随机索引
    for (let i = newArray.length - 1; i > 0; i--) {
        // 步骤1：生成 [0, i] 范围内的均匀随机索引（拒绝采样避免模偏差）
        const randomIndex: number = cryptoRandomInt(i + 1);

        // 步骤3：交换元素
        [newArray[i], newArray[randomIndex]] = [newArray[randomIndex], newArray[i]];
    }
    return newArray
}

/**
 * @description 从源数组中随机获取指定数量的元素
 * @param {Array} sourceArray 源数组
 * @param {number} count 要获取的元素数量
 * @returns {Array} 随机获取的元素
 */

export function getRandomElements<T>(sourceArray: T[], count: number): T[] {
    if (count <= 0)
        return []
    if (count >= sourceArray.length) {
        return shuffleBrowserCrypto([...sourceArray])
    } // 抽全部=洗牌

    const newArray = [...sourceArray]
    const result: T[] = []

    // 抽取 count 个元素，每轮选一个随机索引加入结果，然后从原数组移除
    for (let i = 0; i < count; i++) {
        const randomIndex = cryptoRandomInt(newArray.length)

        // 添加选中的元素到结果数组
        result.push(newArray[randomIndex])
        // 从原数组中移除已选中的元素，避免重复选择
        newArray.splice(randomIndex, 1)
    }

    return result
}
