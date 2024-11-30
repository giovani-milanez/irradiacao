import React from 'react';

// Define types for props
type SpinnerSize = 'small' | 'medium' | 'large';
type SpinnerColor = 'blue' | 'gray' | 'green' | 'red';

// Define interface for component props
interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'blue',
  className = ''
}) => {
  // Define size classes with type safety
  const sizeClasses: Record<SpinnerSize, string> = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  // Define color classes with type safety
  const colorClasses: Record<SpinnerColor, string> = {
    blue: 'border-blue-500 border-t-blue-200',
    gray: 'border-gray-500 border-t-gray-200',
    green: 'border-green-500 border-t-green-200',
    red: 'border-red-500 border-t-red-200'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          border-4 
          border-solid 
          rounded-full 
          animate-spin
          ${className}
        `}
      />
    </div>
  );
};

export default LoadingSpinner;