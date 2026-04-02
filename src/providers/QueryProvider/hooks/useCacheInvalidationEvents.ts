import type { QueryClient } from '@tanstack/react-query'

import { useWorldCacheInvalidation } from './useWorldCacheInvalidation'

/**
 * 注册缓存失效：与 Pqttec-Admin QueryProvider 相同结构。
 * 本项目仅有 world 查询；若日后增加 auth/catalog 等，再拆 hooks 并在此汇总。
 */
export function useCacheInvalidationEvents(queryClient: QueryClient) {
  useWorldCacheInvalidation(queryClient)
}
