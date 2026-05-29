export function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  pulse: number = 1
): void {
  const outer = ctx.createRadialGradient(x, y, 0, x, y, radius * 3 * pulse)
  outer.addColorStop(0, color + '40')
  outer.addColorStop(1, color + '00')
  ctx.fillStyle = outer
  ctx.beginPath()
  ctx.arc(x, y, radius * 3 * pulse, 0, Math.PI * 2)
  ctx.fill()

  const inner = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5)
  inner.addColorStop(0, color)
  inner.addColorStop(1, color + '80')
  ctx.fillStyle = inner
  ctx.beginPath()
  ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2)
  ctx.fill()
}

export function drawStarCore(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
): void {
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2)
  ctx.fill()
}

export function getPulse(phase: number): number {
  return Math.sin(Date.now() * 0.001 + phase) * 0.2 + 0.8
}
