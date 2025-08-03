'use client'

import React, { useState, useEffect } from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCounterProps {
  value: number
  label: string
  icon: LucideIcon
  color: string
  prefix?: string
  suffix?: string
  decimals?: number
  loading?: boolean
  animationDuration?: number
}

export default function StatsCounter({
  value,
  label,
  icon: Icon,
  color,
  prefix = '',
  suffix = '',
  decimals = 0,
  loading = false,
  animationDuration = 2000
}: StatsCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (loading) return

    setIsAnimating(true)
    const startTime = Date.now()
    const startValue = displayValue
    const difference = value - startValue

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / animationDuration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (difference * easeOut)

      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }, [value, loading, animationDuration, displayValue])

  const formatValue = (num: number): string => {
    if (loading) return '---'

    const rounded = decimals > 0 ? num.toFixed(decimals) : Math.floor(num)
    const formatted = Number(rounded).toLocaleString()
    
    return `${prefix}${formatted}${suffix}`
  }

  if (loading) {
    return (
      <div className="glass-dark rounded-xl p-4 border border-slate-700 animate-pulse">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
          <div className="w-4 h-4 bg-slate-700 rounded"></div>
        </div>
        <div className="h-8 bg-slate-700 rounded mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
      </div>
    )
  }

  return (
    <div className="glass-dark rounded-xl p-4 border border-slate-700 hover:border-purple-500/30 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg bg-slate-800/50 ${color} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`w-2 h-2 rounded-full ${isAnimating ? 'animate-pulse bg-green-400' : 'bg-slate-600'}`}></div>
      </div>
      
      <div className={`text-2xl md:text-3xl font-bold text-white mb-1 ${isAnimating ? 'animate-pulse' : ''}`}>
        {formatValue(displayValue)}
      </div>
      
      <div className="text-xs md:text-sm text-slate-400 font-medium">
        {label}
      </div>
      
      {/* Animated background effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}
