import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  useNodesState,
  useEdgesState,
  MarkerType,
  addEdge,
  Position,
  NodeProps,
  Connection,
  Edge as EdgeType,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface LangNodeData {
  id: string;
  name: string;
  type: 'llm' | 'prompt' | 'tool' | 'chain' | 'agent' | 'output' | 'memory';
  status: 'idle' | 'running' | 'completed' | 'error';
  metadata?: {
    model?: string;
    tokens?: number;
    latency?: string;
    cost?: number;
    memory_used?: string;
  };
}

interface WorkflowStep {
  input: any;
  output: any;
  timestamp: string;
  duration: number;
  status: 'success' | 'error';
}

interface WorkflowMetrics {
  totalTokens: number;
  totalCost: number;
  averageLatency: string;
  successRate: number;
}

interface LangWorkflow {
  nodes: Node<LangNodeData>[];
  edges: Edge[];
}

// Custom Nodes
const LangNodeStyles: Record<LangNodeData['type'], { bg: string; border: string; icon: string }> = {
  llm: { 
    bg: 'bg-purple-50', 
    border: 'border-purple-500',
    icon: '🤖'
  },
  prompt: { 
    bg: 'bg-blue-50', 
    border: 'border-blue-500',
    icon: '📝'
  },
  tool: { 
    bg: 'bg-green-50', 
    border: 'border-green-500',
    icon: '🔧'
  },
  chain: { 
    bg: 'bg-yellow-50', 
    border: 'border-yellow-500',
    icon: '⛓️'
  },
  agent: { 
    bg: 'bg-red-50', 
    border: 'border-red-500',
    icon: '🕵️'
  },
  output: { 
    bg: 'bg-gray-50', 
    border: 'border-gray-500',
    icon: '📤'
  },
  memory: { 
    bg: 'bg-pink-50', 
    border: 'border-pink-500',
    icon: '💾'
  }
};

const LangNode: React.FC<NodeProps<LangNodeData>> = ({ data }) => {
  const style = LangNodeStyles[data.type];
  
  return (
    <div className={`px-4 py-2 shadow-lg rounded-lg border ${style.border} ${style.bg}`}>
      <div className="flex items-center">
        <span className="text-2xl mr-2">{style.icon}</span>
        <div>
          <div className="font-bold">{data.name}</div>
          <div className="text-xs text-gray-500">{data.type.toUpperCase()}</div>
        </div>
      </div>
      {data.metadata && (
        <div className="mt-2 text-xs space-y-1">
          {data.metadata.model && (
            <div className="flex justify-between">
              <span>Model:</span>
              <span className="font-medium">{data.metadata.model}</span>
            </div>
          )}
          {data.metadata.tokens && (
            <div className="flex justify-between">
              <span>Tokens:</span>
              <span className="font-medium">{data.metadata.tokens}</span>
            </div>
          )}
          {data.metadata.latency && (
            <div className="flex justify-between">
              <span>Latency:</span>
              <span className="font-medium">{data.metadata.latency}</span>
            </div>
          )}
          {data.metadata.cost && (
            <div className="flex justify-between">
              <span>Cost:</span>
              <span className="font-medium">${data.metadata.cost.toFixed(3)}</span>
            </div>
          )}
          {data.metadata.memory_used && (
            <div className="flex justify-between">
              <span>Memory:</span>
              <span className="font-medium">{data.metadata.memory_used}</span>
            </div>
          )}
        </div>
      )}
      <div className={`mt-2 h-1 rounded ${
        data.status === 'running' ? 'bg-blue-500 animate-pulse' :
        data.status === 'completed' ? 'bg-green-500' :
        data.status === 'error' ? 'bg-red-500' :
        'bg-gray-300'
      }`} />
    </div>
  );
};

// Mock data for the Marriott concierge workflow
const mockWorkflow: LangWorkflow = {
  nodes: [
    {
      id: 'input_1',
      type: 'prompt',
      data: {
        id: 'input_1',
        name: 'Guest Query',
        type: 'prompt',
        status: 'completed',
        metadata: {
          tokens: 150,
          latency: '0.2s'
        }
      },
      position: { x: 0, y: 100 }
    },
    {
      id: 'llm_1',
      type: 'llm',
      data: {
        id: 'llm_1',
        name: 'Query Classifier',
        type: 'llm',
        status: 'completed',
        metadata: {
          model: 'GPT-4',
          tokens: 250,
          latency: '0.8s',
          cost: 0.02
        }
      },
      position: { x: 250, y: 0 }
    },
    {
      id: 'chain_1',
      type: 'chain',
      data: {
        id: 'chain_1',
        name: 'Reservation Chain',
        type: 'chain',
        status: 'running',
        metadata: {
          tokens: 400,
          latency: '1.2s'
        }
      },
      position: { x: 250, y: 200 }
    },
    {
      id: 'tool_1',
      type: 'tool',
      data: {
        id: 'tool_1',
        name: 'Booking API',
        type: 'tool',
        status: 'idle',
        metadata: {
          latency: '0.5s'
        }
      },
      position: { x: 500, y: 100 }
    },
    {
      id: 'memory_1',
      type: 'memory',
      data: {
        id: 'memory_1',
        name: 'Guest Context',
        type: 'memory',
        status: 'completed',
        metadata: {
          memory_used: '2.5MB'
        }
      },
      position: { x: 500, y: 300 }
    },
    {
      id: 'agent_1',
      type: 'agent',
      data: {
        id: 'agent_1',
        name: 'Concierge Agent',
        type: 'agent',
        status: 'running',
        metadata: {
          model: 'GPT-4',
          tokens: 800,
          latency: '2.1s'
        }
      },
      position: { x: 750, y: 150 }
    },
    {
      id: 'output_1',
      type: 'output',
      data: {
        id: 'output_1',
        name: 'Response',
        type: 'output',
        status: 'idle',
        metadata: {
          tokens: 200
        }
      },
      position: { x: 1000, y: 100 }
    }
  ],
  edges: [
    {
      id: 'e1-2',
      source: 'input_1',
      target: 'llm_1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8B1538' },
      markerEnd: { type: MarkerType.ArrowClosed }
    },
    {
      id: 'e1-3',
      source: 'input_1',
      target: 'chain_1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8B1538' },
      markerEnd: { type: MarkerType.ArrowClosed }
    },
    {
      id: 'e2-4',
      source: 'llm_1',
      target: 'tool_1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8B1538' },
      markerEnd: { type: MarkerType.ArrowClosed }
    },
    {
      id: 'e3-5',
      source: 'chain_1',
      target: 'memory_1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8B1538' },
      markerEnd: { type: MarkerType.ArrowClosed }
    },
    {
      id: 'e4-6',
      source: 'tool_1',
      target: 'agent_1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8B1538' },
      markerEnd: { type: MarkerType.ArrowClosed }
    },
    {
      id: 'e5-6',
      source: 'memory_1',
      target: 'agent_1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8B1538' },
      markerEnd: { type: MarkerType.ArrowClosed }
    },
    {
      id: 'e6-7',
      source: 'agent_1',
      target: 'output_1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8B1538' },
      markerEnd: { type: MarkerType.ArrowClosed }
    }
  ]
};

const nodeTypes: Record<LangNodeData['type'], React.FC<NodeProps<LangNodeData>>> = {
  llm: LangNode,
  prompt: LangNode,
  tool: LangNode,
  chain: LangNode,
  agent: LangNode,
  output: LangNode,
  memory: LangNode,
};

const LangGraphFlow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<LangNodeData>(mockWorkflow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(mockWorkflow.edges);
  const [metrics, setMetrics] = useState<WorkflowMetrics>({
    totalTokens: 2000,
    totalCost: 0.15,
    averageLatency: '1.2s',
    successRate: 98.5
  });

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8B1538' },
      markerEnd: { type: MarkerType.ArrowClosed }
    }, eds));
  }, [setEdges]);

  // Simulate workflow progress
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.data.status === 'running') {
            return {
              ...node,
              data: {
                ...node.data,
                status: Math.random() > 0.7 ? 'completed' : 'running'
              }
            };
          }
          if (node.data.status === 'idle' && 
              nodes.some(n => 
                edges.some(e => 
                  e.source === n.id && 
                  e.target === node.id && 
                  n.data.status === 'completed'
                )
              )) {
            return {
              ...node,
              data: {
                ...node.data,
                status: 'running'
              }
            };
          }
          return node;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [nodes, edges, setNodes]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Tokens</div>
          <div className="text-2xl font-semibold">{metrics.totalTokens}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Cost</div>
          <div className="text-2xl font-semibold">${metrics.totalCost}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Avg Latency</div>
          <div className="text-2xl font-semibold">{metrics.averageLatency}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Success Rate</div>
          <div className="text-2xl font-semibold">{metrics.successRate}%</div>
        </div>
      </div>

      <div className="h-[600px] bg-gray-50 rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const nodeData = node.data as LangNodeData;
              return nodeData.status === 'completed' ? '#22c55e' :
                     nodeData.status === 'running' ? '#3b82f6' :
                     nodeData.status === 'error' ? '#ef4444' :
                     '#6b7280';
            }}
            maskColor="#ffffff50"
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default LangGraphFlow; 