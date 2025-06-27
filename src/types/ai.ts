// Vector Database Types
export interface VectorCollection {
  name: string;
  count: number;
  size: string;
}

export interface VectorDatabaseStats {
  totalEmbeddings: number;
  dimensions: number;
  lastUpdated: string;
  collections: VectorCollection[];
}

// Graph Database Types
export interface GraphNodeType {
  type: string;
  count: number;
}

export interface GraphDatabaseStats {
  totalNodes: number;
  totalRelationships: number;
  lastUpdated: string;
  nodeTypes: GraphNodeType[];
}

// AI Assistant Types
export interface AIAssistant {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'paused';
  totalCalls: number;
  avgResponseTime: number;
  lastActive: string;
  successRate: number;
}

// Performance Types
export interface PerformanceMetrics {
  totalRequests: number;
  avgLatency: number;
  errorRate: number;
  costPerDay: number;
}

export interface TimeSeriesData {
  time: string;
  requests: number;
  latency: number;
  errors: number;
}

export interface ModelUsage {
  name: string;
  requests: number;
  cost: number;
}

export interface ErrorType {
  type: string;
  count: number;
} 