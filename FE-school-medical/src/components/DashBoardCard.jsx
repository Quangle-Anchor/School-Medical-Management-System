import React from 'react';

const DashboardCard = ({ title, value, change, changeType, icon: Icon }) => {
  // Define gradient colors for different card types
  const getGradientClass = (index = 0) => {
    const gradients = ['gradient-primary', 'gradient-info', 'gradient-success', 'gradient-warning', 'gradient-dark'];
    return gradients[index % gradients.length];
  };

  return (
    <div className="dashboard-card fade-in">
      <div className={`card-icon ${getGradientClass(Math.floor(Math.random() * 5))}`}>
        <Icon size={24} />
      </div>
      
      <div className="pt-4">
        <p className="card-title">{title}</p>
        <h4 className="card-value">{value}</h4>
      </div>
      
      <hr className="my-4 border-gray-200" />
      
      <div className="flex items-center">
        <span className={`card-change ${changeType === 'positive' ? 'change-positive' : 'change-negative'}`}>
          {change}
        </span>
        <span className="ml-2 text-gray-500 text-sm">since last week</span>
      </div>
    </div>
  );
};

export default DashboardCard;