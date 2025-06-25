import React from 'react';
import { Play, Pause, Square, Loader2 } from 'lucide-react';

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
  const isCurrentMessage = audioState.messageId === messageId;
  const showControls = isCurrentMessage && !audioState.isLoading;
  const showLoader = isCurrentMessage && audioState.isLoading;

  return (
    <div className={`mb-4 ${isUser ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-[#8B1538] text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-grow">{text}</div>
          {!isUser && (
            <div className="flex items-center space-x-2 ml-2">
              {showLoader ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onPlayPause(messageId, text)}
                    className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                    title={isCurrentMessage && audioState.isPlaying ? "Pause" : "Play"}
                  >
                    {isCurrentMessage && audioState.isPlaying ? (
                      <Pause className="w-5 h-5 text-gray-700" />
                    ) : (
                      <Play className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                  {showControls && audioState.isPlaying && (
                    <button
                      onClick={onStop}
                      className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                      title="Stop"
                    >
                      <Square className="w-5 h-5 text-gray-700" />
                    </button>
                  )}
                </div>
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