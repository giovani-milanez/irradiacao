import React, { ReactNode } from 'react';

interface PanelProps {
  title: string;
  children: ReactNode;
}

const Panel: React.FC<PanelProps> = ({
  title,
  children
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke p-5 px-7.5 dark:border-strokedark">
        <h4 className="text-xl font-semibold text-black dark:text-white dark:hover:text-primary">
          {title}
        </h4>
      </div>
      <div className="px-7.5 pb-9 pt-6">
        {children}
      </div>
    </div>
  );
};

export default Panel;