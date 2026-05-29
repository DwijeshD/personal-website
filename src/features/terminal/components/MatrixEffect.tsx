'use client'

import { useEffect, useRef } from 'react'

interface MatrixEffectProps {
  onStop: () => void
}

export default function MatrixEffect({ onStop }: MatrixEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const cv  = canvas as NonNullable<typeof canvas>
    const ctx = cv.getContext('2d')!

    const FS    = 14
    const CHARS = 'ｦｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789'

    let cols = 0
    let drops: number[] = []
    let bgR = 30, bgG = 30, bgB = 30

    function resize() {
      cv.width  = cv.offsetWidth  || cv.clientWidth
      cv.height = cv.offsetHeight || cv.clientHeight
      const rgb = getComputedStyle(cv.parentElement!).backgroundColor.match(/\d+/g)?.map(Number) ?? [30, 30, 30]
      bgR = rgb[0]; bgG = rgb[1]; bgB = rgb[2]
      const newCols = Math.floor(cv.width / FS)
      if (newCols !== cols) {
        cols = newCols
        drops = Array.from({ length: cols }, (_, i) => -Math.floor(Math.random() * 30 + i % 10))
      }
      ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`
      ctx.fillRect(0, 0, cv.width, cv.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    function onKey() { onStop() }
    window.addEventListener('keydown', onKey)

    const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)]

    let raf: number
    let last = 0
    function draw(ts: number) {
      raf = requestAnimationFrame(draw)
      if (ts - last < 40) return
      last = ts

      ctx.fillStyle = `rgba(${bgR},${bgG},${bgB},0.07)`
      ctx.fillRect(0, 0, cv.width, cv.height)
      ctx.font = `bold ${FS}px monospace`
      ctx.textAlign = 'left'

      for (let i = 0; i < cols; i++) {
        const py = drops[i] * FS
        if (py >= 0 && py < cv.height) {
          ctx.fillStyle = 'rgba(210,255,210,0.98)'
          ctx.fillText(randChar(), i * FS, py)
        }
        drops[i]++
        if (drops[i] * FS > cv.height && Math.random() > 0.975)
          drops[i] = -Math.floor(Math.random() * 25)
      }
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('keydown', onKey)
    }
  }, [onStop])

  return (
    <div className="flex-1 relative overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-green-400/40 pointer-events-none select-none">
        press any key to exit
      </div>
    </div>
  )
}
