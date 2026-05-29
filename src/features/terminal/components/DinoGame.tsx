'use client'

import { useEffect, useRef } from 'react'

interface DinoGameProps {
  onStop: () => void
}

export default function DinoGame({ onStop }: DinoGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const cv = canvas as NonNullable<typeof canvas>
    const ctx = cv.getContext('2d')!

    const LH = 150, GY = 127, DX = 80, DW = 44, DH = 43
    const S  = () => cv.height / LH
    const LW = () => cv.width  / S()
    const p  = (n: number) => n * S()

    function resize() {
      cv.width  = cv.clientWidth  || cv.offsetWidth
      cv.height = cv.clientHeight || cv.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    const mkImg = (src: string) => { const i = new Image(); i.src = src; return i }
    const imgRun1  = mkImg('/dino/trex-run1.webp')
    const imgRun2  = mkImg('/dino/trex-run2.webp')
    const imgDead  = mkImg('/dino/trex-dead.webp')
    const imgDuck  = mkImg('/dino/trex-duck1.webp')
    const imgCSm   = mkImg('/dino/cactus-small.webp')
    const imgCLg   = mkImg('/dino/cactus-large.webp')
    const imgCloud = mkImg('/dino/cloud.png')

    const tintCache = new Map<HTMLImageElement, HTMLCanvasElement>()
    function getTinted(img: HTMLImageElement): HTMLCanvasElement | null {
      if (!img.complete || !img.naturalWidth) return null
      if (!tintCache.has(img)) {
        const off = document.createElement('canvas')
        off.width = img.naturalWidth; off.height = img.naturalHeight
        const c = off.getContext('2d')!
        c.drawImage(img, 0, 0)
        c.globalCompositeOperation = 'source-in'
        c.fillStyle = 'rgba(255,255,255,0.92)'
        c.fillRect(0, 0, off.width, off.height)
        tintCache.set(img, off)
      }
      return tintCache.get(img)!
    }

    function drawSprite(img: HTMLImageElement, lx: number, ly: number, lw: number, lh: number): boolean {
      const t = getTinted(img)
      if (!t) return false
      ctx.drawImage(t, 0, 0, t.width, t.height, p(lx), p(ly), p(lw), p(lh))
      return true
    }

    const WHT = 'rgba(255,255,255,0.9)'
    function drawPtero(lx: number, ly: number, wingsUp: boolean) {
      ctx.fillStyle = WHT
      ctx.fillRect(p(lx+4),  p(ly+12), p(26), p(10))
      ctx.fillRect(p(lx+22), p(ly+9),  p(10), p(6))
      ctx.fillRect(p(lx+30), p(ly+11), p(5),  p(3))
      ctx.fillRect(p(lx+8),  p(ly+20), p(3),  p(8))
      ctx.fillRect(p(lx+14), p(ly+20), p(3),  p(8))
      if (wingsUp) {
        ctx.fillRect(p(lx),    p(ly),    p(28), p(6))
        ctx.fillRect(p(lx+2),  p(ly+4),  p(6),  p(5))
        ctx.fillRect(p(lx+10), p(ly+6),  p(16), p(6))
      } else {
        ctx.fillRect(p(lx+2),  p(ly+20), p(24), p(6))
        ctx.fillRect(p(lx+10), p(ly+24), p(14), p(6))
      }
    }

    let started = false, over = false
    let dy = GY - DH, vy = 0, grounded = true, ducking = false
    let speed = 6, score = 0, hi = 0, tick = 0
    let nextObs = 60 + Math.random() * 60, horizX = 0
    type Obs = { x: number; w: number; h: number; type: 'S'|'L'|'P'; py?: number }
    let obs: Obs[] = []
    let clouds = [{ x: 100, y: 20 }, { x: 280, y: 13 }, { x: 460, y: 28 }]

    function jump() {
      if (!started) { started = true; return }
      if (over)     { doRestart(); return }
      if (grounded) { vy = -8; grounded = false; ducking = false }
    }
    function doRestart() {
      dy = GY - DH; vy = 0; grounded = true; ducking = false
      speed = 6; score = 0; tick = 0; nextObs = 60 + Math.random() * 60
      over = false; started = true; horizX = 0; obs = []
    }
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'c') { e.preventDefault(); onStop(); return }
      if (e.key === 'Escape') { e.preventDefault(); onStop(); return }
      if (e.key === ' ' || e.key === 'ArrowUp')  { e.preventDefault(); jump() }
      if (e.key === 'ArrowDown') { e.preventDefault(); if (started && !over && grounded) ducking = true }
    }
    function onKeyUp(e: KeyboardEvent) { if (e.key === 'ArrowDown') ducking = false }
    function onTouch(e: TouchEvent)    { e.preventDefault(); jump() }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup',   onKeyUp)
    cv.addEventListener('touchstart', onTouch, { passive: false })

    let raf: number
    function loop() {
      const lw = LW()

      if (started && !over) {
        tick++
        vy += 0.55; dy += vy
        if (dy >= GY - DH) { dy = GY - DH; vy = 0; grounded = true }
        speed = 6 + Math.floor(score / 200) * 0.5
        score++; horizX += speed
        for (const c of clouds) {
          c.x -= speed * 0.3
          if (c.x + 46 < 0) { c.x = lw + Math.random() * 80; c.y = 8 + Math.random() * 22 }
        }
        if (--nextObs <= 0) {
          const usePtero = score > 4000 && Math.random() < 0.25
          if (usePtero) {
            const yOpts = [GY - 45, GY - 67, GY - 87]
            obs.push({ x: lw + 10, w: 42, h: 30, type: 'P',
                       py: yOpts[Math.floor(Math.random() * yOpts.length)] })
          } else {
            obs.push(Math.random() < 0.45
              ? { x: lw + 10, w: 46, h: 46, type: 'L' }
              : { x: lw + 10, w: 17, h: 35, type: 'S' })
          }
          nextObs = Math.floor(60 + Math.random() * 80)
        }
        obs = obs.filter(o => { o.x -= speed; return o.x + o.w > -10 })
        const dinoTop = ducking ? GY - DH * 0.55 : dy
        const dinoH   = ducking ? DH * 0.55       : DH
        const PAD = 5
        for (const o of obs) {
          const oTop = o.type === 'P' ? o.py! : GY - o.h
          if (DX + DW - PAD > o.x + PAD && DX + PAD < o.x + o.w - PAD &&
              dinoTop + PAD < oTop + o.h - PAD && dinoTop + dinoH - PAD > oTop + PAD) {
            over = true; if (score > hi) hi = score
          }
        }
      } else if (!started) { tick++ }

      ctx.clearRect(0, 0, cv.width, cv.height)

      for (const c of clouds) {
        drawSprite(imgCloud, c.x, c.y, 46, 14)
      }

      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.fillRect(0, p(GY), cv.width, p(1.5))
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      for (let dx2 = (horizX % 16); dx2 < lw; dx2 += 16) {
        ctx.fillRect(p(dx2),     p(GY + 3), p(3), p(1))
        ctx.fillRect(p(dx2 + 9), p(GY + 5), p(2), p(1))
      }

      for (const o of obs) {
        if (o.type === 'S') {
          drawSprite(imgCSm, o.x, GY - o.h, o.w, o.h)
        } else if (o.type === 'L') {
          drawSprite(imgCLg, o.x, GY - o.h, o.w, o.h)
        } else {
          drawPtero(o.x, o.py!, Math.floor(tick / 8) % 2 === 0)
        }
      }

      const runF     = Math.floor(tick / 6) % 2
      const dinoY    = ducking && started ? GY - DH * 0.55 : dy
      const isDucking = ducking && started && !over
      if (isDucking) {
        drawSprite(imgDuck, DX, dinoY, 59, DH)
      } else if (over) {
        drawSprite(imgDead, DX, dinoY, DW, DH)
      } else {
        drawSprite(runF === 0 ? imgRun1 : imgRun2, DX, dinoY, DW, DH)
      }

      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.font = `bold ${p(12)}px 'Courier New', monospace`
      ctx.textAlign = 'right'
      ctx.fillText(
        `HI ${String(Math.floor(hi / 5)).padStart(5,'0')}  ${String(Math.floor(score / 5)).padStart(5,'0')}`,
        cv.width - p(8), p(18)
      )

      if (!started) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.font = `bold ${p(11)}px 'Courier New', monospace`
        ctx.textAlign = 'center'
        ctx.fillText('Press SPACE or ↑ to start', cv.width / 2, p(GY - 30))
      }
      if (over) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.font = `bold ${p(13)}px 'Courier New', monospace`
        ctx.textAlign = 'center'
        ctx.fillText('G A M E  O V E R', cv.width / 2, p(GY / 2 - 5))
        ctx.font = `${p(9)}px 'Courier New', monospace`
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.fillText('SPACE to restart  ·  Ctrl+C to exit', cv.width / 2, p(GY / 2 + 12))
      }

      raf = requestAnimationFrame(loop)
    }

    const allImgs = [imgRun1, imgRun2, imgDead, imgDuck, imgCSm, imgCLg, imgCloud]
    Promise.all(allImgs.map(img =>
      img.complete ? Promise.resolve() : new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res() })
    )).then(() => { raf = requestAnimationFrame(loop) })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup',   onKeyUp)
      cv.removeEventListener('touchstart', onTouch)
    }
  }, [onStop])

  return <canvas ref={canvasRef} className="flex-1 w-full" />
}
