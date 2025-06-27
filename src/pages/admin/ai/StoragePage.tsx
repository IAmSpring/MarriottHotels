import React from 'react';
import {
  Database,
  Share2,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Network,
} from 'lucide-react';
import {
  VectorCollection,
  VectorDatabaseStats,
  GraphNodeType,
  GraphDatabaseStats,
} from '../../../types/ai';

// Mock data for vector and graph databases
const mockVectorData: VectorDatabaseStats = {
  totalEmbeddings: 25000,
  dimensions: 1536,
  lastUpdated: '2024-03-27 13:45',
  collections: [
    { name: 'hotel_descriptions', count: 8500, size: '42MB' },
    { name: 'customer_feedback', count: 12000, size: '58MB' },
    { name: 'service_docs', count: 4500, size: '25MB' },
  ],
};

const mockGraphData: GraphDatabaseStats = {
  totalNodes: 12500,
  totalRelationships: 28000,
  lastUpdated: '2024-03-27 13:45',
  nodeTypes: [
    { type: 'Hotel', count: 2500 },
    { type: 'Customer', count: 8000 },
    { type: 'Service', count: 2000 },
  ],
};

interface DatabaseStatsProps {
  title: string;
  icon: React.ElementType;
  stats: {
    [key: string]: string | number;
  };
}

const DatabaseStats: React.FC<DatabaseStatsProps> = ({ title, icon: Icon, stats }) => (
  <div className="bg-white rounded-lg shadow p-6 mb-6">
    <div className="flex items-center mb-4">
      <Icon className="w-6 h-6 mr-2 text-[#8B1538]" />
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      ))}
    </div>
  </div>
);

interface CollectionTableProps {
  data: VectorCollection[] | GraphNodeType[];
  type: 'vector' | 'graph';
}

const CollectionTable: React.FC<CollectionTableProps> = ({ data, type }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="p-6">
      <h3 className="text-lg font-medium mb-4">
        {type === 'vector' ? 'Vector Collections' : 'Node Types'}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {type === 'vector' ? 'Collection' : 'Type'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
              {type === 'vector' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{type === 'vector' ? (item as VectorCollection).name : (item as GraphNodeType).type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{type === 'vector' ? (item as VectorCollection).count : (item as GraphNodeType).count}</td>
                {type === 'vector' && (
                  <td className="px-6 py-4 whitespace-nowrap">{(item as VectorCollection).size}</td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">
                    <Search className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

interface DatabaseActionsProps {
  type: 'vector' | 'graph';
}

const DatabaseActions: React.FC<DatabaseActionsProps> = ({ type }) => (
  <div className="flex gap-4 mb-6">
    <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
      <Plus className="w-4 h-4 mr-2" />
      Add {type === 'vector' ? 'Collection' : 'Node Type'}
    </button>
    <button className="flex items-center px-4 py-2 border border-[#8B1538] text-[#8B1538] rounded-lg hover:bg-[#8B1538] hover:text-white">
      <RefreshCw className="w-4 h-4 mr-2" />
      Sync
    </button>
    <button className="flex items-center px-4 py-2 border border-[#8B1538] text-[#8B1538] rounded-lg hover:bg-[#8B1538] hover:text-white">
      <Share2 className="w-4 h-4 mr-2" />
      Export
    </button>
  </div>
);

const AIStoragePage: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">AI Storage Management</h1>
        <p className="text-gray-600">Manage vector and graph databases for AI operations</p>
      </div>

      {/* Vector Database Section */}
      <section className="mb-8">
        <DatabaseStats
          title="Vector Database (pgvector)"
          icon={Database}
          stats={{
            totalEmbeddings: mockVectorData.totalEmbeddings.toLocaleString(),
            dimensions: mockVectorData.dimensions,
            lastUpdated: mockVectorData.lastUpdated,
          }}
        />
        <DatabaseActions type="vector" />
        <CollectionTable data={mockVectorData.collections} type="vector" />
      </section>

      {/* Graph Database Section */}
      <section>
        <DatabaseStats
          title="Graph Database (Neo4j)"
          icon={Network}
          stats={{
            totalNodes: mockGraphData.totalNodes.toLocaleString(),
            totalRelationships: mockGraphData.totalRelationships.toLocaleString(),
            lastUpdated: mockGraphData.lastUpdated,
          }}
        />
        <DatabaseActions type="graph" />
        <CollectionTable data={mockGraphData.nodeTypes} type="graph" />
      </section>
    </div>
  );
};

export default AIStoragePage; 