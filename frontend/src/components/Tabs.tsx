import React, { useEffect, useState } from 'react';

export interface TabItem {
  label: string;
  content: React.ComponentType;
}

export type ChronometerStatus = 'idle' | 'running' | 'paused';

interface TabsProps {
  tabs: TabItem[];
  onFontChange?: (font: string) => void
  activeTab?: number;
  onTabChange?: (tabIndex: number) => void;
  chronometerElapsedSeconds?: number;
  onChronometerElapsedSecondsChange?: React.Dispatch<React.SetStateAction<number>>;
  chronometerStatus?: ChronometerStatus;
  onChronometerStatusChange?: React.Dispatch<React.SetStateAction<ChronometerStatus>>;
}

interface ChronometerProps {
  elapsedSeconds?: number;
  onElapsedSecondsChange?: React.Dispatch<React.SetStateAction<number>>;
  status?: ChronometerStatus;
  onStatusChange?: React.Dispatch<React.SetStateAction<ChronometerStatus>>;
}

const Chronometer: React.FC<ChronometerProps> = ({ elapsedSeconds, onElapsedSecondsChange, status, onStatusChange }) => {
  const [internalElapsedSeconds, setInternalElapsedSeconds] = useState(0);
  const [internalStatus, setInternalStatus] = useState<ChronometerStatus>('idle');
  const currentElapsedSeconds = elapsedSeconds ?? internalElapsedSeconds;
  const currentStatus = status ?? internalStatus;
  const setElapsedSeconds = onElapsedSecondsChange ?? setInternalElapsedSeconds;
  const setStatus = onStatusChange ?? setInternalStatus;

  useEffect(() => {
    if (currentStatus !== 'running') return;

    const interval = setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStatus, setElapsedSeconds]);

  const minutes = Math.floor(currentElapsedSeconds / 60).toString().padStart(2, '0');
  const seconds = (currentElapsedSeconds % 60).toString().padStart(2, '0');

  return (
    <div className="flex h-10 items-center gap-2">
      <span className="font-mono text-xl font-bold tracking-wide text-gray-900">{minutes}:{seconds}</span>

      {currentStatus === 'idle' && (
        <button
          type="button"
          aria-label="Iniciar cronometro"
          onClick={() => setStatus('running')}
          className="flex h-10 w-10 items-center justify-center rounded border border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-green-600">
            <path d="M8 5v14l11-7-11-7z" />
          </svg>
        </button>
      )}

      {currentStatus === 'running' && (
        <button
          type="button"
          aria-label="Pausar cronometro"
          onClick={() => setStatus('paused')}
          className="flex h-10 w-10 items-center justify-center rounded border border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-yellow-600">
            <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
          </svg>
        </button>
      )}

      {currentStatus === 'paused' && (
        <>
          <button
            type="button"
            aria-label="Retomar cronometro"
            onClick={() => setStatus('running')}
            className="flex h-10 w-10 items-center justify-center rounded border border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-green-600">
              <path d="M8 5v14l11-7-11-7z" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Resetar cronometro"
            onClick={() => {
              setElapsedSeconds(0);
              setStatus('idle');
            }}
            className="flex h-10 w-10 items-center justify-center rounded border border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-red-600">
              <path d="M12 5a7 7 0 1 1-6.93 8H3l3.5-3.5L10 13H7.08A5 5 0 1 0 12 7V5z" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

const Tabs: React.FC<TabsProps> = ({
  tabs,
  onFontChange,
  activeTab,
  onTabChange,
  chronometerElapsedSeconds,
  onChronometerElapsedSecondsChange,
  chronometerStatus,
  onChronometerStatusChange
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(0);
  const [fontSize, setFontSize] = useState(3);
  const selectedTab = activeTab ?? internalActiveTab;

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
              onClick={() => {
                onTabChange?.(index);
                if (activeTab === undefined) {
                  setInternalActiveTab(index);
                }
              }}
              className={`
              border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base
              ${selectedTab === index
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
          <div className="flex items-center py-4">
            <Chronometer
              elapsedSeconds={chronometerElapsedSeconds}
              onElapsedSecondsChange={onChronometerElapsedSecondsChange}
              status={chronometerStatus}
              onStatusChange={onChronometerStatusChange}
            />
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
                ${selectedTab === index ? 'block' : 'hidden'}
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