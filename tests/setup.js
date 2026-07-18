import { vi } from 'vitest'

// jsdom has no canvas implementation; a full 2D-context stub lets the
// animation components run their real code paths silently in every test
const makeCtx = () => ({
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  roundRect: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  arc: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  setLineDash: vi.fn(),
  measureText: () => ({ width: 42 }),
  createLinearGradient: () => ({ addColorStop: vi.fn() }),
  font: '',
  textAlign: '',
  textBaseline: '',
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  globalAlpha: 1,
})
HTMLCanvasElement.prototype.getContext = function getContext() {
  return makeCtx()
}

// inert by default so mounted components don't run free-spinning loops;
// canvas-loop.test.js overrides these with a controllable queue
vi.stubGlobal('requestAnimationFrame', () => 0)
vi.stubGlobal('cancelAnimationFrame', () => {})
