import React, { useState, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { navigationLogger } from '../utils/navigationLogger';

export const NavigationController: React.FC = () => {
  const {
    state: { actions, isExecuting, currentActionIndex, error, screenshot, isPaused },
    executeActions,
    clearActions,
    stopExecution,
    pauseExecution,
    resumeExecution,
    adjustVolume
  } = useNavigation();

  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    adjustVolume(newVolume);
    navigationLogger.info('Volume adjusted', { volume: newVolume });
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">AI Navigation Guide</h3>
        <div className="flex space-x-2 items-center">
          {isExecuting ? (
            <>
              {isPaused ? (
                <button
                  onClick={resumeExecution}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Resume
                </button>
              ) : (
                <button
                  onClick={pauseExecution}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Pause
                </button>
              )}
              <button
                onClick={stopExecution}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Stop
              </button>
            </>
          ) : (
            <>
              <button
                onClick={executeActions}
                disabled={actions.length === 0}
                className={`px-4 py-2 rounded ${
                  actions.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Start
              </button>
              <button
                onClick={clearActions}
                disabled={actions.length === 0}
                className={`px-4 py-2 rounded ${
                  actions.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                Clear
              </button>
            </>
          )}
          <div className="relative">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="bg-gray-100 p-2 rounded hover:bg-gray-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={volume === 0 
                    ? "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    : "M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"}
                />
              </svg>
            </button>
            {showVolumeSlider && (
              <div className="absolute bottom-full right-0 mb-2 bg-white p-2 rounded shadow-lg">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-32"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {actions.map((action, index) => (
          <div
            key={index}
            className={`p-2 rounded ${
              index === currentActionIndex
                ? 'bg-blue-100 border-blue-500 border-2'
                : index < currentActionIndex
                ? 'bg-green-100'
                : 'bg-gray-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                {action.delay ? `${action.delay}ms delay` : 'No delay'}
              </span>
            </div>
            <div className="text-sm text-gray-600 truncate">
              {action.selector}
              {action.value && ` → "${action.value}"`}
            </div>
          </div>
        ))}
      </div>

      {screenshot && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Latest Screenshot</h4>
          <img
            src={screenshot}
            alt="Page Screenshot"
            className="w-full rounded border border-gray-200"
          />
        </div>
      )}
    </div>
  );
}; 