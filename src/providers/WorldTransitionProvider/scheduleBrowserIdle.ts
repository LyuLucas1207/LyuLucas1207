/**
 * 在浏览器帧间空闲时段执行任务（`requestIdleCallback`），避免收口动画与布局/主线程同步抢同一时刻。
 * 无 API 时退化为 `setTimeout(0)`。
 */
export function scheduleBrowserIdleTask(
  task: () => void,
  options?: { timeout?: number },
): { cancel: () => void } {
  const timeout = options?.timeout ?? 2000

  if (typeof requestIdleCallback !== 'undefined') {
    const id = requestIdleCallback(() => task(), { timeout })
    return {
      cancel: () => {
        if (typeof cancelIdleCallback !== 'undefined') {
          cancelIdleCallback(id)
        }
      },
    }
  }

  const id = window.setTimeout(task, 0)
  return { cancel: () => clearTimeout(id) }
}
