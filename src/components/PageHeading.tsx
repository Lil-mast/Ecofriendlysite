import React from 'react'

interface PageHeadingProps {
  title: string
  subtitle?: string
  className?: string
}

const PageHeading: React.FC<PageHeadingProps> = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`text-center ${className}`}>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default PageHeading
