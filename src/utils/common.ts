/** Transform record to option */
export function transformRecordToOption<T extends Record<string, string>>(record: T) {
  return Object.entries(record).map(([value, label]) => ({
    label,
    value
  })) as CommonType.Option<keyof T>[]
}

/** Translate options - 直接返回，label已是中文 */
export function translateOptions(options: CommonType.Option<string>[]) {
  return options
}

/**
 * Toggle html class
 *
 * @param className
 */
export function toggleHtmlClass(className: string) {
  function add() {
    document.documentElement.classList.add(className)
  }

  function remove() {
    document.documentElement.classList.remove(className)
  }

  return {
    add,
    remove
  }
}

export function getKeys(obj: Record<string, any>, parentKeys: string[] = []): string[] {
  let keys: string[] = []

  for (const key in obj) {
    if (key) {
      const newKeys = [...parentKeys, key]
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys = keys.concat(getKeys(obj[key], newKeys))
      } else {
        keys = newKeys
      }
    }
  }

  return keys
}
