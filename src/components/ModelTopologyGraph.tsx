import React, { useCallback } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';

interface ModelNode {
  id: string;
  name: string;
  type: 'base' | 'fine-tuned' | 'ensemble' | 'specialized';
  status: 'active' | 'training' | 'deprecated';
  version: string;
  metrics: {
    accuracy: number;
    latency: string;
    throughput: number;
  };
  dependencies?: string[];
}

const CustomNode: React.FC<{ data: ModelNode }> = ({ data }) => (
  <div className={`px-4 py-2 shadow-lg rounded-lg border ${
    data.status === 'active' ? 'border-green-500 bg-green-50' :
    data.status === 'training' ? 'border-blue-500 bg-blue-50' :
    'border-gray-500 bg-gray-50'
  }`}>
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full mr-2 ${
        data.status === 'active' ? 'bg-green-500' :
        data.status === 'training' ? 'bg-blue-500' :
        'bg-gray-500'
      }`} />
      <div>
        <div className="font-bold">{data.name}</div>
        <div className="text-xs text-gray-500">v{data.version}</div>
      </div>
    </div>
    <div className="mt-2 text-xs">
      <div className="flex justify-between">
        <span>Accuracy:</span>
        <span className="font-medium">{data.metrics.accuracy}%</span>
      </div>
      <div className="flex justify-between">
        <span>Latency:</span>
        <span className="font-medium">{data.metrics.latency}</span>
      </div>
    </div>
  </div>
);

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const ModelTopologyGraph: React.FC<{ models: ModelNode[] }> = ({ models }) => {
  // Convert models to React Flow nodes
  const initialNodes: Node[] = models.map((model, index) => ({
    id: model.id,
    type: 'custom',
    position: { 
      x: 250 * (index % 3), 
      y: 200 * Math.floor(index / 3) 
    },
    data: model,
  }));

  // Create edges based on model dependencies
  const initialEdges: Edge[] = models.flatMap(model =>
    model.dependencies?.map(depId => ({
      id: `${depId}-${model.id}`,
      source: depId,
      target: model.id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8B1538' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#8B1538',
      },
    })) || []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8B1538' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#8B1538',
      },
    }, eds));
  }, [setEdges]);

  return (
    <div className="h-[600px] w-full bg-gray-50 rounded-lg">
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
            const nodeData = node.data as ModelNode;
            return nodeData.status === 'active' ? '#22c55e' :
                   nodeData.status === 'training' ? '#3b82f6' :
                   '#6b7280';
          }}
          maskColor="#ffffff50"
        />
      </ReactFlow>
    </div>
  );
};

export default ModelTopologyGraph; 