import React, { useState } from 'react';

export interface TabItem {
  label: string;
  content: React.ComponentType;
}

interface TabsProps {
  tabs: TabItem[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
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