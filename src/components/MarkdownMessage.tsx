import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Play, Pause, Square, Loader2 } from 'lucide-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';

SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

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

const parseJsonResponse = (text: string): string => {
  return text || '';
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

  const isCurrentMessage = audioState.messageId === messageId;
  const showControls = isCurrentMessage && !audioState.isLoading;
  const showLoader = isCurrentMessage && audioState.isLoading;

  // Parse JSON responses for assistant messages
  const displayText = isUser ? text : parseJsonResponse(text);

  return (
    <div className={`mb-4 ${isUser ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block rounded-lg px-4 py-2 max-w-[85%] ${
          isUser
            ? 'bg-[#8B1538] text-white prose-invert'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="flex flex-col">
          <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}>
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="m-0">{children}</p>,
                ul: ({ children }) => <ul className="m-0 pl-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="m-0 pl-4 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="m-0">{children}</li>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                a: ({ href, children }) => (
                  <a href={href} className={`${isUser ? 'text-white' : 'text-[#8B1538]'} underline`} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  if (!match) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <div style={{ margin: 0 }}>
                      <SyntaxHighlighter
                        language={match[1]}
                        style={vscDarkPlus as any}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {displayText}
            </ReactMarkdown>
          </div>
          {!isUser && (
            <div className="flex justify-end mt-2 space-x-2">
              {showLoader ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handlePlayClick}
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

export default MarkdownMessage;
