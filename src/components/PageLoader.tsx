import React, { useEffect, useState } from 'react'

const PageLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'complete' | 'exit'>('loading')

  useEffect(() => {
    // Progress bar fills over ~1.8s in steps
    const steps = [
      { target: 30, delay: 0,    duration: 300 },
      { target: 60, delay: 300,  duration: 400 },
      { target: 85, delay: 700,  duration: 500 },
      { target: 100, delay: 1200, duration: 300 },
    ]

    const timers: ReturnType<typeof setTimeout>[] = []

    steps.forEach(({ target, delay, duration }) => {
      const t = setTimeout(() => {
        const start = Date.now()
        const startVal = progress

        const tick = () => {
          const elapsed = Date.now() - start
          const pct = Math.min(elapsed / duration, 1)
          // ease out cubic
          const eased = 1 - Math.pow(1 - pct, 3)
          setProgress(Math.round(startVal + (target - startVal) * eased))
          if (pct < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }, delay)
      timers.push(t)
    })

    // After progress hits 100, brief hold then exit
    const completeTimer = setTimeout(() => {
      setPhase('complete')
    }, 1500)

    const exitTimer = setTimeout(() => {
      setPhase('exit')
    }, 1900)

    const doneTimer = setTimeout(() => {
      onComplete()
    }, 2500) // matches exit transition duration

    timers.push(completeTimer, exitTimer, doneTimer)
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-50 transition-opacity duration-500 ${
        phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-200/20 rounded-full blur-2xl" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo */}
        <div
          className={`transition-all duration-700 ${
            phase === 'loading' ? 'opacity-100 scale-100' : 'opacity-100 scale-105'
          }`}
        >
          <img
            src="/images/club_logo.svg"
            alt="Land Rover Club Tanzania"
            className="w-24 h-24 object-contain drop-shadow-lg"
          />
        </div>

        {/* Club name */}
        <div
          className={`text-center transition-all duration-700 delay-200 ${
            phase === 'loading' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
          style={{ transitionDelay: phase === 'loading' ? '200ms' : '0ms' }}
        >
          <p className="text-lg font-bold text-gray-900 tracking-wide">Land Rover Club</p>
          <p className="text-sm text-gray-500 tracking-widest uppercase">Tanzania</p>
        </div>

        {/* Progress bar */}
        <div className="w-48 flex flex-col items-center gap-2">
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 tabular-nums">{progress}%</span>
        </div>
      </div>
    </div>
  )
}

export default PageLoader