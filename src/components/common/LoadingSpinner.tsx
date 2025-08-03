'use client'

import React from 'react'
import { Loader2, Globe } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullScreen?: boolean
  variant?: 'default' | 'dots' | 'pulse' | 'brand'
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
}

export default function LoadingSpinner({
  size = 'md',
  text,
  fullScreen = false,
  variant = 'default',
  className = ''
}: LoadingSpinnerProps) {
  const spinnerSize = sizeClasses[size]
  const textSize = textSizeClasses[size]

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )
      
      case 'pulse':
        return (
          <div className={`${spinnerSize} bg-purple-500 rounded-full animate-pulse`}></div>
        )
      
      case 'brand':
        return (
          <div className="relative">
            <Globe className={`${spinnerSize} text-purple-400 animate-spin`} />
            <div className={`absolute inset-0 ${spinnerSize} rounded-full bg-purple-400/20 animate-pulse`}></div>
          </div>
        )
      
      default:
        return (
          <Loader2 className={`${spinnerSize} text-purple-500 animate-spin`} />
        )
    }
  }

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {renderSpinner()}
      {text && (
        <p className={`text-slate-300 font-medium ${textSize} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900/50 backdrop-blur-md border border-purple-500/20 rounded-xl p-8 shadow-2xl">
          {content}
        </div>
      </div>
    )
  }

  return content
}

// Skeleton loader component
interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function Skeleton({ className = '', children }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-slate-700 rounded ${className}`}>
      {children}
    </div>
  )
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="glass-dark rounded-xl p-6 border border-slate-700 animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-5/6 mb-2" />
      <Skeleton className="h-3 w-4/6" />
    </div>
  )
}

// Table skeleton
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-8" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Stats skeleton
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-dark rounded-xl p-4 border border-slate-700 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-2 h-2 rounded-full" />
          </div>
          <Skeleton className="h-8 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  )
}
