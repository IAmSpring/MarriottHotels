import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import fs from 'fs/promises';
import path from 'path';
import type { Components } from 'react-markdown';

interface DocsPageProps {
  content: string;
}

export const getServerSideProps: GetServerSideProps<DocsPageProps> = async (context) => {
  try {
    const { slug = ['README'] } = context.params || {};
    const docPath = Array.isArray(slug) ? slug.join('/') : slug;
    const filePath = path.join(process.cwd(), 'public', 'docs', `${docPath}.md`);
    const content = await fs.readFile(filePath, 'utf-8');
    
    return {
      props: {
        content
      }
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
};

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const DocsPage: React.FC<DocsPageProps> = ({ content }) => {
  const router = useRouter();

  const components: Partial<Components> = {
    code: ({ inline, className, children }: CodeProps) => (
      inline ? (
        <code className="bg-gray-100 rounded px-1 py-0.5">{children}</code>
      ) : (
        <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
          <code>{children}</code>
        </pre>
      )
    ),
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#8B1538] hover:underline">
        {children}
      </a>
    ),
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-medium text-gray-700 mt-6 mb-3">{children}</h3>
    ),
  };

  // Custom link renderer to handle internal doc links
  const LinkRenderer = (props: any) => {
    const { href, children } = props;
    
    // Handle internal documentation links
    if (href.startsWith('./')) {
      const internalPath = href.substring(2).replace(/\.md$/, '');
      const segments = internalPath.split('/');
      return (
        <Link href={`/docs/${segments.join('/')}`} className="text-[#8B1538] hover:underline">
          {children}
        </Link>
      );
    }

    // External links
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#8B1538] hover:underline">
        {children}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Navigation Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 fixed h-full overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Documentation</h3>
        <nav className="space-y-2">
          <Link href="/docs" className="block text-gray-600 hover:text-[#8B1538]">
            Overview
          </Link>
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-500 mt-4">Architecture</h4>
            <Link href="/docs/architecture/system-overview" className="block text-sm text-gray-600 hover:text-[#8B1538] pl-2">
              System Overview
            </Link>
            <Link href="/docs/architecture/component-structure" className="block text-sm text-gray-600 hover:text-[#8B1538] pl-2">
              Component Structure
            </Link>
            <Link href="/docs/architecture/data-flow" className="block text-sm text-gray-600 hover:text-[#8B1538] pl-2">
              Data Flow
            </Link>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-500 mt-4">AI Integration</h4>
            <Link href="/docs/ai/assistant-architecture" className="block text-sm text-gray-600 hover:text-[#8B1538] pl-2">
              Assistant Architecture
            </Link>
            <Link href="/docs/ai/openai-integration" className="block text-sm text-gray-600 hover:text-[#8B1538] pl-2">
              OpenAI Integration
            </Link>
            <Link href="/docs/ai/voice-processing" className="block text-sm text-gray-600 hover:text-[#8B1538] pl-2">
              Voice Processing
            </Link>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-500 mt-4">Features</h4>
            <Link href="/docs/features/chatbot-implementation" className="block text-sm text-gray-600 hover:text-[#8B1538] pl-2">
              Chatbot Implementation
            </Link>
            <Link href="/docs/features/voice-integration" className="block text-sm text-gray-600 hover:text-[#8B1538] pl-2">
              Voice Integration
            </Link>
          </div>
        </nav>
      </div>

      {/* Content Area */}
      <div className="ml-64 flex-1">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <article className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={components}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
