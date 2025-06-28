import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Revenue {
  date: string;
  amount: number;
  source: 'DIRECT' | 'OTA' | 'CORPORATE';
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartLabelProps {
  name: string;
  percent?: number;
}

const mockRevenue: Revenue[] = [
  { date: '2024-03-01', amount: 5000, source: 'DIRECT' },
  { date: '2024-03-02', amount: 3500, source: 'OTA' },
  { date: '2024-03-03', amount: 7500, source: 'CORPORATE' },
  { date: '2024-03-04', amount: 4500, source: 'DIRECT' },
  { date: '2024-03-05', amount: 6000, source: 'OTA' },
  { date: '2024-03-06', amount: 8000, source: 'CORPORATE' },
  { date: '2024-03-07', amount: 5500, source: 'DIRECT' },
  { date: '2024-03-08', amount: 4000, source: 'OTA' },
  { date: '2024-03-09', amount: 9000, source: 'CORPORATE' },
  { date: '2024-03-10', amount: 6500, source: 'DIRECT' }
];

const RevenuePage: React.FC = () => {
  const directRevenue = mockRevenue.filter(r => r.source === 'DIRECT').reduce((sum, r) => sum + r.amount, 0);
  const otaRevenue = mockRevenue.filter(r => r.source === 'OTA').reduce((sum, r) => sum + r.amount, 0);
  const corporateRevenue = mockRevenue.filter(r => r.source === 'CORPORATE').reduce((sum, r) => sum + r.amount, 0);
  const totalRevenue = directRevenue + otaRevenue + corporateRevenue;

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      description: 'Total revenue from all sources'
    },
    {
      title: 'Direct Bookings',
      value: `$${directRevenue.toLocaleString()}`,
      description: 'Revenue from direct hotel bookings'
    },
    {
      title: 'OTA Revenue',
      value: `$${otaRevenue.toLocaleString()}`,
      description: 'Revenue from online travel agencies'
    },
    {
      title: 'Corporate Revenue',
      value: `$${corporateRevenue.toLocaleString()}`,
      description: 'Revenue from corporate bookings'
    }
  ];

  const pieData: PieChartData[] = [
    { name: 'Direct', value: directRevenue, color: '#10B981' },
    { name: 'OTA', value: otaRevenue, color: '#3B82F6' },
    { name: 'Corporate', value: corporateRevenue, color: '#6366F1' }
  ];

  const renderPieLabel = ({ name, percent }: PieChartLabelProps) => {
    return `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Revenue Overview</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
          <p className="text-3xl font-bold mt-2">{stat.value}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.description}</p>
        </div>
      ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Revenue Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={renderPieLabel}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenuePage; 