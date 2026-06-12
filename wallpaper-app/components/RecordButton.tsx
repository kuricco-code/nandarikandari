'use client'

import { useState, useRef, useCallback } from 'react'

interface RecordButtonProps {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}

export function RecordButton({ canvasRef }: RecordButtonProps) {
  const [recording, setRecording] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || recording) return

    chunksRef.current = []

    const stream = canvas.captureStream(30)
    const mimeTypes = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4',
    ]
    const supportedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) ?? ''

    const recorder = new MediaRecorder(stream, supportedMime ? { mimeType: supportedMime } : {})
    recorderRef.current = recorder

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'solar-wallpaper.webm'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    recorder.start()
    setRecording(true)
    setCountdown(10)

    let remaining = 10
    const iv = setInterval(() => {
      remaining -= 1
      setCountdown(remaining)
      if (remaining <= 0) {
        clearInterval(iv)
        recorder.stop()
        setRecording(false)
      }
    }, 1000)
  }, [canvasRef, recording])

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={startRecording}
        disabled={recording}
        className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
          recording
            ? 'bg-red-600 text-white cursor-not-allowed animate-pulse'
            : 'bg-white text-black hover:bg-gray-100 active:scale-95'
        }`}
      >
        {recording ? `⏺ 録画中... ${countdown}秒` : '⬇ 壁紙用に録画してDL (10秒)'}
      </button>
      {!recording && (
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          WebM動画をダウンロード。iOSでは<br />
          「intoLive」等でLive写真に変換できます
        </p>
      )}
    </div>
  )
}
