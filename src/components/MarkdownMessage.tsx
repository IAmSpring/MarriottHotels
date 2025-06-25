import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Play, Pause, Square } from 'lucide-react';

interface MarkdownMessageProps {
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

// Helper function to strip markdown for TTS
const stripMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
    .replace(/#{1,6}\s/g, '')       // Remove headers
    .replace(/`{1,3}.*?`{1,3}/g, '') // Remove code blocks
    .replace(/\n/g, ' ')            // Replace newlines with spaces
    .trim();
};

const MarkdownMessage: React.FC<MarkdownMessageProps> = ({
  text,
  isUser,
  timestamp,
  messageId,
  audioState,
  onPlayPause,
  onStop,
}) => {
  const handlePlayClick = () => {
    const cleanText = stripMarkdown(text);
    onPlayPause(messageId, cleanText);
  };

  return (
    <div className={`mb-4 ${isUser ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-[#8B1538] text-white'
            : 'bg-gray-100 text-white'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="mr-3 prose prose-sm max-w-none prose-invert">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
          {!isUser && (
            <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
              <button
                onClick={handlePlayClick}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {audioState.messageId === messageId && audioState.isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white" />
                )}
              </button>
              {audioState.messageId === messageId && (
                <button
                  onClick={onStop}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Square className="w-4 h-4 text-white" />
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

export default MarkdownMessage;
