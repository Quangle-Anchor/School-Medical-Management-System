import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 240 },
  { name: 'Feb', value: 180 },
  { name: 'Mar', value: 320 },
  { name: 'Apr', value: 190 },
  { name: 'May', value: 380 },
  { name: 'Jun', value: 220 },
  { name: 'Jul', value: 290 },
];

const ChartCard = () => {
  return (
    <div  className="rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
  style={{
    background: `linear-gradient(
      45deg,
      rgba(142,197,252,1)   0%,
      rgba(141,211,255,1)  25%,
      rgba(161,216,255,1)  50%,
      rgba(193,210,255,1)  75%,
      rgba(224,195,255,1) 100%
    )`
  }}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Patient Visits</h3>
        <p className="text-sm text-muted-foreground">Monthly patient visits for this year</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#ffffff' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 , fill: '#ffffff'}}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="value" fill="#ffffff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;