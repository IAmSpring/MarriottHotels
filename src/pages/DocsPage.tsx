import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const DocsPage: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const { '*': path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const response = await fetch(`/docs/${path || 'README.md'}`);
        if (!response.ok) {
          throw new Error('Failed to load documentation');
        }
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Error loading documentation:', error);
        navigate('/docs');
      }
    };

    fetchDoc();
  }, [path, navigate]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-lg prose-indigo max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default DocsPage; 