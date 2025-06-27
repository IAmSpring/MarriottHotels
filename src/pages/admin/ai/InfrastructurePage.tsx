import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Box,
  Brain,
  CircuitBoard,
  Cloud,
  Code2,
  Cpu,
  Database,
  GitGraph,
  HardDrive,
  LineChart,
  Network,
  Plus,
  RefreshCw,
  Server,
  Settings,
  Share2,
  Shield,
  Workflow,
  X,
} from 'lucide-react';

interface ResourceMetric {
  id: string;
  name: string;
  value: string | number;
  change: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface LangGraphNode {
  id: string;
  name: string;
  type: 'llm' | 'tool' | 'human' | 'vector_store' | 'memory';
  status: 'active' | 'idle' | 'error';
  metrics: {
    requests: number;
    latency: string;
    cost: number;
    errors: number;
  };
}

interface LangGraphEdge {
  from: string;
  to: string;
  traffic: number;
  latency: string;
}

interface ServiceHealth {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: string;
  responseTime: string;
  lastIncident?: string;
}

// Mock data
const mockMetrics: ResourceMetric[] = [
  {
    id: 'metric_1',
    name: 'Total LLM Cost',
    value: '$245.82',
    change: -8.5,
    status: 'healthy',
  },
  {
    id: 'metric_2',
    name: 'Avg Graph Latency',
    value: '1.2s',
    change: 12.3,
    status: 'warning',
  },
  {
    id: 'metric_3',
    name: 'Graph Success Rate',
    value: '98.5%',
    change: 0.5,
    status: 'healthy',
  },
  {
    id: 'metric_4',
    name: 'Active Graphs',
    value: '8',
    change: 25,
    status: 'healthy',
  },
];

const mockNodes: LangGraphNode[] = [
  {
    id: 'node_1',
    name: 'Concierge GPT-4',
    type: 'llm',
    status: 'active',
    metrics: {
      requests: 15783,
      latency: '0.85s',
      cost: 125.45,
      errors: 23,
    },
  },
  {
    id: 'node_2',
    name: 'Booking Intent',
    type: 'llm',
    status: 'active',
    metrics: {
      requests: 8925,
      latency: '0.65s',
      cost: 75.30,
      errors: 12,
    },
  },
  {
    id: 'node_3',
    name: 'Knowledge Base',
    type: 'vector_store',
    status: 'active',
    metrics: {
      requests: 45892,
      latency: '0.12s',
      cost: 15.20,
      errors: 8,
    },
  },
  {
    id: 'node_4',
    name: 'Conversation Memory',
    type: 'memory',
    status: 'active',
    metrics: {
      requests: 25000,
      latency: '0.05s',
      cost: 5.50,
      errors: 2,
    },
  },
];

const mockEdges: LangGraphEdge[] = [
  {
    from: 'node_1',
    to: 'node_3',
    traffic: 12500,
    latency: '0.95s',
  },
  {
    from: 'node_1',
    to: 'node_4',
    traffic: 8500,
    latency: '0.75s',
  },
  {
    from: 'node_2',
    to: 'node_3',
    traffic: 6200,
    latency: '0.82s',
  },
];

const mockServices: ServiceHealth[] = [
  {
    id: 'svc_1',
    name: 'LangGraph Orchestrator',
    status: 'healthy',
    uptime: '99.99%',
    responseTime: '45ms',
  },
  {
    id: 'svc_2',
    name: 'Vector Store Cluster',
    status: 'degraded',
    uptime: '99.95%',
    responseTime: '120ms',
    lastIncident: '2h ago',
  },
  {
    id: 'svc_3',
    name: 'Memory Store',
    status: 'healthy',
    uptime: '99.99%',
    responseTime: '25ms',
  },
  {
    id: 'svc_4',
    name: 'OpenAI Proxy',
    status: 'healthy',
    uptime: '99.98%',
    responseTime: '180ms',
  },
];

// Add new interfaces for modals
interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

// Add after mockServices
const initialNodes: Node[] = mockNodes.map((node, index) => ({
  id: node.id,
  type: 'default',
  position: { x: 250 * (index % 2), y: 150 * Math.floor(index / 2) },
  data: { label: node.name },
  style: {
    background: node.type === 'llm' ? '#F3E8FF' : 
                node.type === 'vector_store' ? '#DBEAFE' : 
                node.type === 'memory' ? '#DCFCE7' : '#F3F4F6',
    border: '1px solid',
    borderColor: node.type === 'llm' ? '#A855F7' : 
                node.type === 'vector_store' ? '#3B82F6' : 
                node.type === 'memory' ? '#22C55E' : '#9CA3AF',
    borderRadius: '8px',
    padding: '10px',
    width: 180,
  },
}));

const initialEdges: Edge[] = mockEdges.map((edge, index) => ({
  id: `edge-${index}`,
  source: edge.from,
  target: edge.to,
  animated: true,
  style: { stroke: '#8B1538' },
}));

const MetricCard: React.FC<{ metric: ResourceMetric }> = ({ metric }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm text-gray-600">{metric.name}</h3>
      <span className={`flex items-center text-sm ${
        metric.change > 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        {metric.change > 0 ? '+' : ''}{metric.change}%
      </span>
    </div>
    <p className="text-2xl font-semibold">{metric.value}</p>
    <div className={`mt-2 px-2 py-1 rounded-full text-xs inline-flex items-center ${
      metric.status === 'healthy' ? 'bg-green-100 text-green-800' :
      metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
      'bg-red-100 text-red-800'
    }`}>
      <Activity className="w-3 h-3 mr-1" />
      {metric.status}
    </div>
  </div>
);

const GraphNode: React.FC<{ node: LangGraphNode }> = ({ node }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
          node.type === 'llm' ? 'bg-purple-100 text-purple-700' :
          node.type === 'vector_store' ? 'bg-blue-100 text-blue-700' :
          node.type === 'memory' ? 'bg-green-100 text-green-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {node.type === 'llm' ? <Brain className="w-6 h-6" /> :
           node.type === 'vector_store' ? <Database className="w-6 h-6" /> :
           node.type === 'memory' ? <HardDrive className="w-6 h-6" /> :
           <Box className="w-6 h-6" />}
        </div>
        <div>
          <h3 className="font-semibold">{node.name}</h3>
          <p className="text-sm text-gray-600 capitalize">{node.type}</p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${
        node.status === 'active' ? 'bg-green-100 text-green-800' :
        node.status === 'idle' ? 'bg-gray-100 text-gray-800' :
        'bg-red-100 text-red-800'
      }`}>
        {node.status}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-600">Requests</p>
        <p className="font-semibold">{node.metrics.requests.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Latency</p>
        <p className="font-semibold">{node.metrics.latency}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Cost</p>
        <p className="font-semibold">${node.metrics.cost.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Errors</p>
        <p className="font-semibold">{node.metrics.errors}</p>
      </div>
    </div>
  </div>
);

const ServiceStatus: React.FC<{ service: ServiceHealth }> = ({ service }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <Server className="w-5 h-5 text-gray-500 mr-2" />
        <h3 className="font-medium">{service.name}</h3>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${
        service.status === 'healthy' ? 'bg-green-100 text-green-800' :
        service.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {service.status}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-600">Uptime</p>
        <p className="font-medium">{service.uptime}</p>
      </div>
      <div>
        <p className="text-gray-600">Response Time</p>
        <p className="font-medium">{service.responseTime}</p>
      </div>
      {service.lastIncident && (
        <div className="col-span-2">
          <p className="text-gray-600">Last Incident</p>
          <p className="font-medium text-yellow-600">{service.lastIncident}</p>
        </div>
      )}
    </div>
  </div>
);

const InfrastructurePage: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  const renderModalContent = () => {
    switch (activeModal) {
      case 'topology':
        return (
          <div className="space-y-4">
            <p>View and manage your LangGraph topology settings here.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">Node Distribution</h3>
                <p className="text-sm text-gray-600">Configure how nodes are distributed across the infrastructure</p>
              </div>
              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">Edge Routing</h3>
                <p className="text-sm text-gray-600">Manage message routing between nodes</p>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-4">
            <p>Configure security settings for your LangGraph infrastructure.</p>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">Access Control</h3>
                <p className="text-sm text-gray-600">Manage authentication and authorization settings</p>
              </div>
              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">Encryption Settings</h3>
                <p className="text-sm text-gray-600">Configure data encryption at rest and in transit</p>
              </div>
            </div>
          </div>
        );
      case 'resources':
        return (
          <div className="space-y-4">
            <p>Manage resource allocation for your LangGraph components.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">CPU Allocation</h3>
                <div className="h-4 bg-gray-200 rounded">
                  <div className="h-4 bg-[#8B1538] rounded" style={{ width: '70%' }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">70% utilized</p>
              </div>
              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">Memory Usage</h3>
                <div className="h-4 bg-gray-200 rounded">
                  <div className="h-4 bg-[#8B1538] rounded" style={{ width: '45%' }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">45% utilized</p>
              </div>
            </div>
          </div>
        );
      case 'network':
        return (
          <div className="space-y-4">
            <p>Configure network settings for your LangGraph infrastructure.</p>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">Network Topology</h3>
                <p className="text-sm text-gray-600">Current Configuration: Multi-region deployment</p>
              </div>
              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">Load Balancing</h3>
                <p className="text-sm text-gray-600">Active-Active configuration with automatic failover</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Infrastructure</h1>
          <p className="text-gray-600">Monitor LangGraph infrastructure and service health</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
            <Plus className="w-5 h-5 mr-2" />
            New Graph
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">LangGraph Nodes</h2>
              <button className="text-sm text-[#8B1538] hover:text-[#6d102c]">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockNodes.map((node) => (
                <GraphNode key={node.id} node={node} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Graph Visualization</h2>
              <button className="text-sm text-[#8B1538] hover:text-[#6d102c]">
                Expand
              </button>
            </div>
            <div className="h-64 rounded-lg border border-gray-300">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
              >
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6">Service Health</h2>
            <div className="space-y-4">
              {mockServices.map((service) => (
                <ServiceStatus key={service.id} service={service} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => setActiveModal('topology')}
                className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <GitGraph className="w-5 h-5 mr-2 text-[#8B1538]" />
                View Graph Topology
              </button>
              <button
                onClick={() => setActiveModal('security')}
                className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Shield className="w-5 h-5 mr-2 text-[#8B1538]" />
                Security Settings
              </button>
              <button
                onClick={() => setActiveModal('resources')}
                className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <CircuitBoard className="w-5 h-5 mr-2 text-[#8B1538]" />
                Resource Allocation
              </button>
              <button
                onClick={() => setActiveModal('network')}
                className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Network className="w-5 h-5 mr-2 text-[#8B1538]" />
                Network Config
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeModal && (
        <Modal
          title={
            activeModal === 'topology' ? 'Graph Topology' :
            activeModal === 'security' ? 'Security Settings' :
            activeModal === 'resources' ? 'Resource Allocation' :
            'Network Configuration'
          }
          onClose={closeModal}
        >
          {renderModalContent()}
        </Modal>
      )}
    </div>
  );
};

export default InfrastructurePage;