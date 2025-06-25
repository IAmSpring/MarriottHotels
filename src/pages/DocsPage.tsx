import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const DocsPage: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { '*': path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        // Ensure path starts with a forward slash and ends with .md if not provided
        let docPath = path || 'README.md';
        if (!docPath.endsWith('.md')) {
          docPath = `${docPath}.md`;
        }
        if (!docPath.startsWith('/')) {
          docPath = `/${docPath}`;
        }

        // Use the correct base path for the docs
        const response = await fetch(`/MarriottHotels/docs${docPath}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load documentation (${response.status})`);
        }
        
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (error) {
        console.error('Error loading documentation:', error);
        setError(error instanceof Error ? error.message : 'Failed to load documentation');
        if (!path) {
          navigate('/');
        }
      }
    };

    fetchDoc();
  }, [path, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <h2 className="text-red-800 text-lg font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => navigate('/docs')}
              className="mt-4 text-red-700 hover:text-red-800 font-medium"
            >
              Return to Documentation Home
            </button>
          </div>
        ) : (
          <div className="prose prose-lg prose-indigo max-w-none bg-white rounded-lg shadow-sm p-8">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocsPage; 