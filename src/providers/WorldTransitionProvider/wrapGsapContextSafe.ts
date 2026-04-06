/**
 * `@gsap/react` 的 `useGSAP` 回调里 `contextSafe` 类型为可选，运行时浏览器中一般由 GSAP 传入。
 * 兜底为恒等，避免 `Cannot invoke an object which is possibly 'undefined'`。
 */
export function wrapGsapContextSafe(
  contextSafe: undefined | (<T extends () => void>(fn: T) => T),
): <T extends () => void>(fn: T) => T {
  return (contextSafe ?? ((fn: () => void) => fn)) as <T extends () => void>(fn: T) => T
}
