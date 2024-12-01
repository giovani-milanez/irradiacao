import React from 'react';
import Image from 'next/image';

// Define prop types for the card
interface CardProps {
  title: string;
  description?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  imageProps?: {
    src: string;
    alt?: string;
    width: number;
    height: number;
    quality?: number;
    priority?: boolean;
  };
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  content,
  footer,
  className,
  imageProps
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden max-w-sm w-full ${className}`}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        )}

        {imageProps && (
          <div className="relative w-full mb-4">
            <Image
              {...imageProps}
              alt={imageProps.alt || title}
              // layout="fill"
              // objectFit="contain"
              style={{ objectFit: 'fill' }}
              className="rounded-md"
            />
          </div>
        )}

        <div className="text-gray-700 mb-4">
          {content}
        </div>
      </div>

      {footer && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};

// Example usage component
const CardExample: React.FC = () => {
  return (
    <Card
      title="Welcome to Our Platform"
      description="Discover innovative solutions tailored to your needs"
      imageProps={{
        src: "/images/comunidade.png",
        alt: "Platform Overview",
        width: 300,
        height: 50,
        // quality: 75,
        // priority: false
      }}
      content={
        <p>
          We provide cutting-edge technology to transform your business
          with simple, effective, and powerful solutions.
        </p>
      }
      footer={
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Learn More
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      }
    />
  );
};

export { Card, CardExample };