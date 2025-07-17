import React from 'react';

const DashboardCard = ({ title, value, change, changeType, icon: Icon, priority = 'normal' }) => {
  // Define gradient colors based on priority and card type
  // Accent gradient: medical-friendly light blue
  const getGradientClass = () => 'bg-gradient-to-tl from-sky-500 to-sky-600';

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-700 mb-2">{value}</h3>
          <p className="text-sm text-slate-400">
            <span className={`font-semibold ${getChangeColor(changeType)}`}>{change}</span>
          </p>
        </div>
        <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${getGradientClass()} shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;