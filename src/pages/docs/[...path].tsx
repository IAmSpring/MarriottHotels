import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Components } from 'react-markdown/lib/ast-to-react';

interface DocSection {
  title: string;
  path: string;
  subsections?: DocSection[];
}

const docSections: DocSection[] = [
  {
    title: "Overview",
    path: "/docs",
  },
  {
    title: "Architecture",
    path: "/docs/architecture",
    subsections: [
      { title: "System Overview", path: "/docs/architecture/system-overview" },
      { title: "Component Structure", path: "/docs/architecture/component-structure" },
      { title: "Data Flow", path: "/docs/architecture/data-flow" },
      { title: "Security", path: "/docs/architecture/security" }
    ]
  },
  {
    title: "AI Integration",
    path: "/docs/ai",
    subsections: [
      { title: "Assistant Architecture", path: "/docs/ai/assistant-architecture" },
      { title: "OpenAI Integration", path: "/docs/ai/openai-integration" },
      { title: "Voice Processing", path: "/docs/ai/voice-processing" },
      { title: "Conversation Management", path: "/docs/ai/conversation-management" },
      { title: "Models and Prompts", path: "/docs/ai/models-and-prompts" }
    ]
  },
  {
    title: "Frontend",
    path: "/docs/frontend",
    subsections: [
      { title: "Component Architecture", path: "/docs/frontend/component-architecture" },
      { title: "State Management", path: "/docs/frontend/state-management" },
      { title: "Design System", path: "/docs/frontend/design-system" }
    ]
  },
  {
    title: "Backend",
    path: "/docs/backend",
    subsections: [
      { title: "Server Architecture", path: "/docs/backend/server-architecture" },
      { title: "API Design", path: "/docs/backend/api-design" },
      { title: "Database Schema", path: "/docs/backend/database-schema" },
      { title: "Authentication", path: "/docs/backend/authentication" }
    ]
  },
  {
    title: "Features",
    path: "/docs/features",
    subsections: [
      { title: "Chatbot Implementation", path: "/docs/features/chatbot-implementation" },
      { title: "Voice Integration", path: "/docs/features/voice-integration" },
      { title: "Natural Language Processing", path: "/docs/features/natural-language-processing" },
      { title: "Recommendation System", path: "/docs/features/recommendation-system" }
    ]
  }
];

const DocsPage: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { "*": path } = useParams<{ "*": string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setIsLoading(true);
        // If no path is provided, load the README
        const docPath = !path ? 'README.md' : `${path}.md`;
        
        // Log the path being fetched
        console.log('Fetching doc path:', docPath);
        
        // Use the correct base URL for the docs
        const response = await fetch(`/MarriottHotels/docs/${docPath}`);
        
        if (!response.ok) {
          console.error('Failed to load doc:', response.status, response.statusText);
          throw new Error('Documentation not found');
        }
        
        const text = await response.text();
        console.log('Loaded doc content:', text.substring(0, 100) + '...');
        setContent(text);
        setError(null);
      } catch (err) {
        console.error('Documentation fetch error:', err);
        setError('Failed to load documentation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoc();
  }, [path]);

  const renderNavSection = (section: DocSection) => (
    <div key={section.path} className="mb-4">
      <Link 
        to={section.path}
        className="block text-gray-700 hover:text-[#8B1538] font-medium mb-2"
      >
        {section.title}
      </Link>
      {section.subsections && (
        <div className="ml-4 space-y-2">
          {section.subsections.map(subsection => (
            <Link
              key={subsection.path}
              to={subsection.path}
              className="block text-gray-600 hover:text-[#8B1538] text-sm"
            >
              {subsection.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  const components: Components = {
    a: ({ href, children }) => {
      if (href?.startsWith('./')) {
        const internalPath = href.substring(2).replace(/\.md$/, '');
        return (
          <Link 
            to={`/docs/${internalPath}`}
            className="text-[#8B1538] hover:underline"
          >
            {children}
          </Link>
        );
      }
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#8B1538] hover:underline"
        >
          {children}
        </a>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-medium text-gray-700 mt-6 mb-3">{children}</h3>
    ),
    code: ({ node, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !node?.position?.start.line;
      return isInline ? (
        <code className="bg-gray-100 rounded px-1 py-0.5" {...props}>
          {children}
        </code>
      ) : (
        <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
          <code className={match ? `language-${match[1]}` : ''} {...props}>
            {children}
          </code>
        </pre>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 fixed h-full overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Documentation</h3>
        <nav className="space-y-1">
          {docSections.map(renderNavSection)}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <div className="max-w-4xl mx-auto py-12 px-8">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
              <pre className="mt-2 text-sm">{`Failed to load: ${path || 'README.md'}`}</pre>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B1538]"></div>
            </div>
          ) : (
            <article className="prose prose-lg max-w-none">
              <ReactMarkdown components={components}>
                {content}
              </ReactMarkdown>
            </article>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocsPage; 