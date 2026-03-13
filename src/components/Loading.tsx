import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  message?: string
  className?: string
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Loader2 className="h-10 w-10 animate-spin text-green-600 dark:text-green-400" />
      {message && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  )
}

export default Loading
