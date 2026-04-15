/**
 * 数组转为树
 * @param {Array} arr 数组
 * @param {string} id 节点id
 * @param {string} pid 节点pid
 * @return {Array}
 */
export const arrayToTree = (
        arr: any[],
    id: string = 'id',
    pid: string = 'pid',
    childWrap: string = 'children'
): any[] => {
  const map: Record<string, any> = {}
  const result: any[] = []
  arr.forEach((item) => {
    if (!map[item[id]]) {
      map[item[id]] = item
    }
  })

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    const parent = map[item[pid]]
    if (parent) {
      if (parent[childWrap]) {
        parent[childWrap]!.push(item)
      } else {
        parent[childWrap] = [item]
      }
    } else {
      result.push(item)
    }
  }

  return result
}