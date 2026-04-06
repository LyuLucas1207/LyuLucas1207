import * as THREE from 'three'

import type { Nilable, Nullable } from 'nfx-ui/types'
import { safeNullable } from 'nfx-ui/utils'

export type HoverInfo = {
  systemName: string
  label: string
}

export interface KeyState {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  up: boolean
  down: boolean
}

export class SceneInput {
  readonly keys: KeyState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  }

  isDragging = false
  hoveredObject: Nullable<THREE.Object3D> = null

  onDraggingChange?: (dragging: boolean) => void
  onHoverChange?: (info: Nilable<HoverInfo>) => void
  onObjectClick?: (object: THREE.Object3D, event: Pick<PointerEvent, 'button'>) => void
  onBreakFocus?: () => void

  private dragDeltaX = 0
  private dragDeltaY = 0
  private wheelDeltaAccum = 0
  private readonly drag = { active: false, x: 0, y: 0 }
  private readonly dragStart = { x: 0, y: 0 }
  private readonly pointer = new THREE.Vector2()
  private readonly raycaster = new THREE.Raycaster()

  private readonly host: HTMLDivElement
  private readonly getCamera: () => THREE.Camera
  private readonly interactiveObjects: THREE.Object3D[]

  private readonly handlePointerDown: (e: PointerEvent) => void
  private readonly handlePointerMove: (e: PointerEvent) => void
  private readonly handlePointerUp: (e: PointerEvent) => void
  private readonly handleWheel: (e: WheelEvent) => void
  private readonly handleKeyDown: (e: KeyboardEvent) => void
  private readonly handleKeyUp: (e: KeyboardEvent) => void

  constructor(host: HTMLDivElement, getCamera: () => THREE.Camera, interactiveObjects: THREE.Object3D[]) {
    this.host = host
    this.getCamera = getCamera
    this.interactiveObjects = interactiveObjects

    this.handlePointerDown = this.onPointerDown.bind(this)
    this.handlePointerMove = this.onPointerMove.bind(this)
    this.handlePointerUp = this.onPointerUp.bind(this)
    this.handleWheel = this.onWheel.bind(this)
    this.handleKeyDown = this.onKeyDown.bind(this)
    this.handleKeyUp = this.onKeyUp.bind(this)

    host.addEventListener('pointerdown', this.handlePointerDown)
    window.addEventListener('pointermove', this.handlePointerMove)
    window.addEventListener('pointerup', this.handlePointerUp)
    window.addEventListener('pointercancel', this.handlePointerUp)
    host.addEventListener('wheel', this.handleWheel, { passive: false })
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  consumeDragDelta() {
    const dx = this.dragDeltaX
    const dy = this.dragDeltaY
    this.dragDeltaX = 0
    this.dragDeltaY = 0
    return { dx, dy }
  }

  consumeWheelDelta() {
    const delta = this.wheelDeltaAccum
    this.wheelDeltaAccum = 0
    return delta
  }

  destroy() {
    this.host.removeEventListener('pointerdown', this.handlePointerDown)
    window.removeEventListener('pointermove', this.handlePointerMove)
    window.removeEventListener('pointerup', this.handlePointerUp)
    window.removeEventListener('pointercancel', this.handlePointerUp)
    this.host.removeEventListener('wheel', this.handleWheel)
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    this.host.style.cursor = 'default'
  }

  private updateHover(clientX: number, clientY: number) {
    const bounds = this.host.getBoundingClientRect()
    this.pointer.x = ((clientX - bounds.left) / bounds.width) * 2 - 1
    this.pointer.y = -((clientY - bounds.top) / bounds.height) * 2 + 1
    this.raycaster.setFromCamera(this.pointer, this.getCamera())
    const hit = safeNullable(this.raycaster.intersectObjects(this.interactiveObjects, false)[0]?.object)

    if (this.hoveredObject !== hit) {
      if (this.hoveredObject) this.hoveredObject.userData.hovered = false
      this.hoveredObject = hit
      if (this.hoveredObject) this.hoveredObject.userData.hovered = true
      this.host.style.cursor = this.hoveredObject ? 'pointer' : 'default'
      this.onHoverChange?.(
        this.hoveredObject
          ? {
              systemName: this.hoveredObject.userData.systemName as string,
              label: this.hoveredObject.userData.label as string,
            }
          : null,
      )
    }
  }

  private onPointerDown(event: PointerEvent) {
    event.preventDefault()
    this.drag.active = true
    this.drag.x = event.clientX
    this.drag.y = event.clientY
    this.dragStart.x = event.clientX
    this.dragStart.y = event.clientY
    this.isDragging = true
    this.updateHover(event.clientX, event.clientY)
    this.host.setPointerCapture?.(event.pointerId)
    this.onDraggingChange?.(true)
  }

  private onPointerMove(event: PointerEvent) {
    this.updateHover(event.clientX, event.clientY)

    if (!this.drag.active) return

    const dx = event.clientX - this.drag.x
    const dy = event.clientY - this.drag.y
    this.drag.x = event.clientX
    this.drag.y = event.clientY

    this.dragDeltaX += dx
    this.dragDeltaY += dy
  }

  private onPointerUp(event: PointerEvent) {
    const clickDistance = Math.hypot(
      event.clientX - this.dragStart.x,
      event.clientY - this.dragStart.y,
    )
    const isClick = clickDistance < 6 && this.hoveredObject !== null
    this.drag.active = false
    this.isDragging = false
    this.host.releasePointerCapture?.(event.pointerId)
    this.onDraggingChange?.(false)
    if (isClick && this.hoveredObject) {
      this.onObjectClick?.(this.hoveredObject, event)
    }
  }

  private onWheel(event: WheelEvent) {
    event.preventDefault()
    this.onBreakFocus?.()
    this.wheelDeltaAccum += event.deltaY
  }

  private onKeyDown(event: KeyboardEvent) {
    const k = event.key
    const lower = k.toLowerCase()
    const isMove =
      lower === 'w' ||
      lower === 'a' ||
      lower === 's' ||
      lower === 'd' ||
      lower === 'q' ||
      lower === 'e' ||
      k === 'ArrowUp' ||
      k === 'ArrowDown' ||
      k === 'ArrowLeft' ||
      k === 'ArrowRight'
    if (!isMove) return

    if (k === 'ArrowUp' || k === 'ArrowDown' || k === 'ArrowLeft' || k === 'ArrowRight') {
      event.preventDefault()
    }

    this.onBreakFocus?.()

    if (lower === 'w' || k === 'ArrowUp') this.keys.forward = true
    if (lower === 's' || k === 'ArrowDown') this.keys.backward = true
    if (lower === 'a' || k === 'ArrowLeft') this.keys.left = true
    if (lower === 'd' || k === 'ArrowRight') this.keys.right = true
    if (lower === 'q') this.keys.up = true
    if (lower === 'e') this.keys.down = true
  }

  private onKeyUp(event: KeyboardEvent) {
    const k = event.key
    const lower = k.toLowerCase()
    if (lower === 'w' || k === 'ArrowUp') this.keys.forward = false
    if (lower === 's' || k === 'ArrowDown') this.keys.backward = false
    if (lower === 'a' || k === 'ArrowLeft') this.keys.left = false
    if (lower === 'd' || k === 'ArrowRight') this.keys.right = false
    if (lower === 'q') this.keys.up = false
    if (lower === 'e') this.keys.down = false
  }
}
