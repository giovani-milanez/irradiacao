import React, { useState } from 'react';

export interface TabItem {
  label: string;
  content: React.ComponentType;
}

interface TabsProps {
  tabs: TabItem[];
  onFontChange?: (font: string) => void
}

const Tabs: React.FC<TabsProps> = ({ tabs, onFontChange }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [fontSize, setFontSize] = useState(3);

  const fontMap = new Map<number, string>([
    [0, "xs"],
    [1, "sm"],
    [2, "base"],
    [3, "lg"],
    [4, "xl"],
    [5, "2xl"],
    [6, "3xl"]
  ])

  const increaseFontSize = () => {
    if (fontSize < 6) {
      onFontChange?.(fontMap.get(fontSize + 1) || "base")
      setFontSize(fontSize + 1)
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 0) {
      onFontChange?.(fontMap.get(fontSize - 1) || "base")
      setFontSize(fontSize - 1)
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div>
        <div className="mb-6 flex flex-wrap gap-5 border-b border-stroke dark:border-strokedark sm:gap-10">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`
              border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base
              ${activeTab === index
                  ? 'text-primary border-primary'
                  : 'border-transparent'}
            `}
            >
              {tab.label}
            </button>
          ))}
          <div className="flex items-center space-x-1">
            <button
              onClick={decreaseFontSize}
              className="flex items-center justify-center w-20 h-10 border border-gray-300 bg-gray-100 hover:bg-gray-200 transition-colors rounded"
            >
              <span className="text-xs font-bold mr-1">A</span>
              <span className="text-lg font-bold">A</span>
            </button>
            <button
              onClick={increaseFontSize}
              className="flex items-center justify-center w-20 h-10 border border-gray-300 bg-gray-100 hover:bg-gray-200 transition-colors rounded"
            >
              <span className="text-lg font-bold mr-1">A</span>
              <span className="text-2xl font-bold">A</span>
            </button>
          </div>
        </div>
      </div>
      <div>
        {tabs.map((tab, index) => {
          const ContentComponent = tab.content;
          return (
            <div
              key={index}
              className={`
                leading-relaxed 
                overflow-y-auto h-150
                ${activeTab === index ? 'block' : 'hidden'}
              `}
            >
              <ContentComponent />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;