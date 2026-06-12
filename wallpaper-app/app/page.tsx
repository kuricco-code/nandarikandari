'use client'

import { useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { RecordButton } from '@/components/RecordButton'

const SolarSystem = dynamic(
  () => import('@/components/SolarSystem').then((m) => ({ default: m.SolarSystem })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#00000a]">
        <div className="text-center">
          <div className="text-white text-2xl mb-2">🌌</div>
          <p className="text-gray-400 text-sm tracking-widest">LOADING...</p>
        </div>
      </div>
    ),
  }
)

export default function Home() {
  const [speed, setSpeed] = useState(1)
  const [showLabels, setShowLabels] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleCanvas = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#00000a]">
      {/* Full-screen solar system */}
      <div className="absolute inset-0">
        <SolarSystem speedMultiplier={speed} showLabels={showLabels} onCanvas={handleCanvas} />
      </div>

      {/* Title overlay */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none">
        <h1 className="text-white text-xl font-light tracking-[0.25em]">太陽系</h1>
        <p className="text-gray-500 text-[10px] mt-1 tracking-[0.3em] uppercase">
          Solar System Wallpaper
        </p>
      </div>

      {/* Settings toggle */}
      <button
        onClick={() => setShowControls((v) => !v)}
        className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors backdrop-blur-sm"
        aria-label="設定を切り替え"
      >
        {showControls ? '✕' : '⚙'}
      </button>

      {/* Controls panel */}
      {showControls && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[320px] max-w-[calc(100vw-32px)] bg-black/75 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-5">
          {/* Speed slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-white text-sm font-medium">公転速度</span>
              <span className="text-orange-400 text-sm font-mono">{speed.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={30}
              step={0.1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-orange-400"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>ゆっくり</span>
              <span>はやい</span>
            </div>
          </div>

          <div className="border-t border-white/10" />

          {/* Labels toggle */}
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">惑星名を表示</span>
            <button
              onClick={() => setShowLabels((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                showLabels ? 'bg-orange-400' : 'bg-white/20'
              }`}
              aria-label="惑星名表示切り替え"
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
                  showLabels ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-white/10" />

          <RecordButton canvasRef={canvasRef} />
        </div>
      )}

      {/* Hint */}
      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-700 text-[10px] tracking-wider pointer-events-none select-none whitespace-nowrap">
        ドラッグで視点変更 · スクロールでズーム
      </p>
    </div>
  )
}
