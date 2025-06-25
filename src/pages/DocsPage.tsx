import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { useParams, useNavigate, Link } from 'react-router-dom';

interface DocSection {
  title: string;
  path: string;
  subsections?: DocSection[];
}

declare global {
  interface Window {
    mermaid: {
      contentLoaded: () => void;
    };
  }
}

const docSections: DocSection[] = [
  {
    title: "Overview",
    path: "/docs",
  },
  {
    title: "AI",
    path: "/docs/ai",
    subsections: [
      { title: "Assistant Architecture", path: "/docs/ai/assistant-architecture" },
      { title: "Conversation Management", path: "/docs/ai/conversation-management" },
      { title: "Models and Prompts", path: "/docs/ai/models-and-prompts" },
      { title: "OpenAI Integration", path: "/docs/ai/openai-integration" },
      { title: "Voice Processing", path: "/docs/ai/voice-processing" }
    ]
  },
  {
    title: "Architecture",
    path: "/docs/architecture",
    subsections: [
      { title: "Component Structure", path: "/docs/architecture/component-structure" },
      { title: "Data Flow", path: "/docs/architecture/data-flow" },
      { title: "Performance", path: "/docs/architecture/performance" },
      { title: "Security", path: "/docs/architecture/security" },
      { title: "System Overview", path: "/docs/architecture/system-overview" }
    ]
  },
  {
    title: "Backend",
    path: "/docs/backend",
    subsections: [
      { title: "API Design", path: "/docs/backend/api-design" },
      { title: "Authentication", path: "/docs/backend/authentication" },
      { title: "Database Schema", path: "/docs/backend/database-schema" },
      { title: "Server Architecture", path: "/docs/backend/server-architecture" }
    ]
  },
  {
    title: "Deployment",
    path: "/docs/deployment",
    subsections: [
      { title: "Monitoring", path: "/docs/deployment/monitoring" },
      { title: "Production Pipeline", path: "/docs/deployment/production-pipeline" },
      { title: "Scaling", path: "/docs/deployment/scaling" },
      { title: "Security", path: "/docs/deployment/security" }
    ]
  },
  {
    title: "DevOps",
    path: "/docs/devops",
    subsections: [
      { title: "CI/CD Pipeline", path: "/docs/devops/ci-cd-pipeline" },
      { title: "Environment Management", path: "/docs/devops/environment-management" },
      { title: "GitHub Actions", path: "/docs/devops/github-actions" },
      { title: "Monitoring & Logging", path: "/docs/devops/monitoring-logging" }
    ]
  },
  {
    title: "Features",
    path: "/docs/features",
    subsections: [
      { title: "Chatbot Implementation", path: "/docs/features/chatbot-implementation" },
      { title: "Natural Language Processing", path: "/docs/features/natural-language-processing" },
      { title: "Recommendation System", path: "/docs/features/recommendation-system" },
      { title: "Voice Integration", path: "/docs/features/voice-integration" }
    ]
  },
  {
    title: "Frontend",
    path: "/docs/frontend",
    subsections: [
      { title: "Component Architecture", path: "/docs/frontend/component-architecture" },
      { title: "Design System", path: "/docs/frontend/design-system" },
      { title: "State Management", path: "/docs/frontend/state-management" }
    ]
  },
  {
    title: "Infrastructure",
    path: "/docs/infrastructure",
    subsections: [
      { title: "Cloud Infrastructure", path: "/docs/infrastructure/cloud-infrastructure" },
      { title: "Infrastructure as Code", path: "/docs/infrastructure/infrastructure-as-code" },
      { title: "Infrastructure Setup", path: "/docs/infrastructure/infrastructure-setup" },
      { title: "Network Architecture", path: "/docs/infrastructure/network-architecture" }
    ]
  },
  {
    title: "Testing",
    path: "/docs/testing",
    subsections: [
      { title: "AI Component Testing", path: "/docs/testing/ai-component-testing" },
      { title: "Integration Testing", path: "/docs/testing/integration-testing" },
      { title: "Performance Testing", path: "/docs/testing/performance-testing" },
      { title: "Testing Strategy", path: "/docs/testing/testing-strategy" }
    ]
  }
];

const DocsPage: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { "*": path } = useParams<{ "*": string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Effect to re-render Mermaid diagrams when content changes
  useEffect(() => {
    if (window.mermaid && !isLoading && content) {
      setTimeout(() => {
        window.mermaid.contentLoaded();
      }, 100);
    }
  }, [content, isLoading]);

  // Scroll to top when path changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
  }, [path]);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // If no path is provided or path is empty/root, load the README
        const docPath = !path || path === '' ? 'README.md' : `${path}.md`;
        
        // Log the path being fetched for debugging
        console.log('Fetching doc path:', docPath);
        
        // Construct the correct path for the markdown file
        const response = await fetch(`/MarriottHotels/docs/${docPath}`);
        
        if (!response.ok) {
          console.error('Failed to load doc:', response.status, response.statusText);
          if (docPath !== 'README.md') {
            // If the requested doc fails but it's not README, try loading README
            const readmeResponse = await fetch('/MarriottHotels/docs/README.md');
            if (readmeResponse.ok) {
              const text = await readmeResponse.text();
              setContent(text);
              // Navigate to root docs path
              navigate('/docs');
              return;
            }
          }
          throw new Error(`Documentation not found: ${docPath}`);
        }
        
        const text = await response.text();
        console.log('Loaded doc content length:', text.length);
        setContent(text);

        // Scroll to top after content is loaded
        if (contentRef.current) {
          contentRef.current.scrollTo(0, 0);
        }
      } catch (err) {
        console.error('Documentation fetch error:', err);
        setError('Failed to load documentation. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoc();
  }, [path, navigate]);

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

  const components: Partial<Components> = {
    code: ({ className, children }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const codeContent = children?.toString() || '';

      // Handle Mermaid diagrams
      if (language === 'mermaid') {
        return (
          <div className="my-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="mermaid">
              {codeContent}
            </div>
          </div>
        );
      }

      // Regular code blocks
      return (
        <pre className="my-4 bg-gray-800 text-gray-100 rounded-lg p-4 overflow-x-auto">
          <code className={`${className} text-sm font-mono`}>
            {children}
          </code>
        </pre>
      );
    },
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
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-medium text-gray-700 mt-6 mb-3">
        {children}
      </h3>
    )
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 fixed h-screen overflow-y-auto pb-24">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Documentation</h3>
        <nav className="space-y-1 mb-20">
          {docSections.map(renderNavSection)}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <div 
          ref={contentRef}
          className="max-w-4xl mx-auto py-12 px-8 h-full overflow-y-auto"
        >
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
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
