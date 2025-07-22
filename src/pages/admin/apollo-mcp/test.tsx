import React, { useEffect } from 'react';

const ApolloMCPTest: React.FC = () => {
  useEffect(() => {
    console.log('ApolloMCPTest component mounted');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    console.log('User agent:', navigator.userAgent);
  }, []);
  
  console.log('ApolloMCPTest component rendered');
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Apollo MCP Test Page</h1>
      <p className="text-gray-600">This is a test page to debug routing issues.</p>
      <div className="mt-4 p-4 bg-blue-50 rounded">
        <p className="text-sm">Current URL: {window.location.href}</p>
        <p className="text-sm">Pathname: {window.location.pathname}</p>
        <p className="text-sm">Timestamp: {new Date().toISOString()}</p>
      </div>
      <div className="mt-4 p-4 bg-green-50 rounded">
        <p className="text-sm">✅ Component loaded successfully!</p>
        <p className="text-sm">Check browser console for debug info.</p>
      </div>
    </div>
  );
};

export default ApolloMCPTest; 