import React from 'react';

const DashboardCard = ({ title, value, change, changeType, icon: Icon }) => {
  return (
    <div   className="rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
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
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          <p className={`text-sm mt-2 ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;