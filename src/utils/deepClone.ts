/**
 * 深拷贝可枚举的普通对象与数组；`WeakMap` 处理循环引用。
 *
 * - 原始值、`null` 原样返回；**函数**非 object，同样原样返回。
 * - 不处理 `Map` / `Set` / `Date` 等结构化类型（与「仅遍历自有可枚举属性」的语义一致）。
 * - `Symbol` 键、不可枚举属性不会拷贝。
 */
export function deepClone<T>(value: T): T {
  const cache = new WeakMap<object, object>()

  const clone = (input: unknown): unknown => {
    if (typeof input !== 'object' || input === null) {
      return input
    }

    const ref = input as object
    const cached = cache.get(ref)
    if (cached !== undefined) {
      return cached
    }

    const result: object = Array.isArray(input) ? [] : {}
    cache.set(ref, result)
    Object.setPrototypeOf(result, Object.getPrototypeOf(ref))

    const record = input as Record<string, unknown>
    const out = result as Record<string, unknown>
    for (const key in record) {
      if (!Object.prototype.hasOwnProperty.call(record, key)) continue
      out[key] = clone(record[key])
    }
    return result
  }

  return clone(value) as T
}
