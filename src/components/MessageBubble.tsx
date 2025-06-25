import React from 'react';
import { Play, Pause, Square } from 'lucide-react';

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  timestamp: Date;
  messageId: number;
  audioState: {
    messageId: number | null;
    isPlaying: boolean;
    isLoading: boolean;
  };
  onPlayPause: (messageId: number, text: string) => void;
  onStop: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  isUser,
  timestamp,
  messageId,
  audioState,
  onPlayPause,
  onStop,
}) => {
  return (
    <div className={`mb-4 ${isUser ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-[#8B1538] text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="mr-3">{text}</div>
          {!isUser && (
            <div className="flex items-center space-x-1 ml-2">
              <button
                onClick={() => onPlayPause(messageId, text)}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {audioState.messageId === messageId && audioState.isPlaying ? (
                  <Pause className="w-4 h-4 text-gray-600" />
                ) : (
                  <Play className="w-4 h-4 text-gray-600" />
                )}
              </button>
              {audioState.messageId === messageId && (
                <button
                  onClick={onStop}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Square className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {timestamp.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default MessageBubble; 