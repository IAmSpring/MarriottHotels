import React, { useEffect, useState } from 'react';

interface Trace {
  id: string;
  name: string;
  run_type: string;
  start_time: string;
  end_time: string;
  error?: string;
  inputs: any;
  outputs: any;
  extra?: {
    metadata?: Record<string, any>;
  };
}

const TracingPage: React.FC = () => {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTraces = async () => {
      try {
        // For now, show mock data since LangSmith client doesn't work in browser
        const mockTraces: Trace[] = [
          {
            id: 'trace_1',
            name: 'Chat Request',
            run_type: 'chain',
            start_time: new Date(Date.now() - 300000).toISOString(),
            end_time: new Date(Date.now() - 200000).toISOString(),
            inputs: { message: 'Hello, I need help with booking', threadId: 'thread_123' },
            outputs: { response: 'I can help you with booking. What dates are you looking for?' }
          },
          {
            id: 'trace_2',
            name: 'Tool: search_hotels',
            run_type: 'tool',
            start_time: new Date(Date.now() - 250000).toISOString(),
            end_time: new Date(Date.now() - 240000).toISOString(),
            inputs: { location: 'Miami Beach', guests: 2 },
            outputs: { hotels: [{ id: 'hotel_1', name: 'Ritz-Carlton Miami Beach' }] }
          },
          {
            id: 'trace_3',
            name: 'Tool: check_availability',
            run_type: 'tool',
            start_time: new Date(Date.now() - 180000).toISOString(),
            end_time: new Date(Date.now() - 170000).toISOString(),
            inputs: { hotelId: 'hotel_1', checkIn: '2024-08-01', checkOut: '2024-08-05' },
            outputs: { available: true, rooms: [{ type: 'Deluxe King', price: 420 }] }
          }
        ];
        
        setTraces(mockTraces);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch traces');
      } finally {
        setLoading(false);
      }
    };

    fetchTraces();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Note: LangSmith integration requires server-side environment variables.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">LangSmith Traces</h1>
      <p className="text-gray-600 mb-6">Showing mock trace data. Real traces will appear when LangSmith is properly configured.</p>
      
      <div className="space-y-4">
        {traces.map((trace) => (
          <div
            key={trace.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{trace.name}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                trace.error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {trace.error ? 'Error' : 'Success'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Type: {trace.run_type}</p>
                <p className="text-gray-600">
                  Duration: {
                    trace.end_time && trace.start_time
                      ? `${Math.round((new Date(trace.end_time).getTime() - new Date(trace.start_time).getTime()) / 1000)}s`
                      : 'N/A'
                  }
                </p>
              </div>
              
              <div>
                <p className="text-gray-600">
                  Started: {new Date(trace.start_time).toLocaleString()}
                </p>
                {trace.end_time && (
                  <p className="text-gray-600">
                    Ended: {new Date(trace.end_time).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2">
                <h4 className="font-medium">Inputs:</h4>
                <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto">
                  {JSON.stringify(trace.inputs, null, 2)}
                </pre>
              </div>

              {trace.outputs && (
                <div>
                  <h4 className="font-medium">Outputs:</h4>
                  <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto">
                    {JSON.stringify(trace.outputs, null, 2)}
                  </pre>
                </div>
              )}

              {trace.error && (
                <div className="mt-2">
                  <h4 className="font-medium text-red-600">Error:</h4>
                  <pre className="bg-red-50 p-2 rounded text-sm overflow-x-auto text-red-700">
                    {trace.error}
                  </pre>
                </div>
              )}

              {trace.extra?.metadata && (
                <div className="mt-2">
                  <h4 className="font-medium">Metadata:</h4>
                  <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto">
                    {JSON.stringify(trace.extra.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TracingPage; 