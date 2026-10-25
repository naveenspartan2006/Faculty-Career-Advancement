import React from 'react';

const DashboardCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  colorTheme = 'indigo'
}) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon-wrapper stat-icon-${colorTheme}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div className="stat-content">
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        {subtext && <div className="stat-subtext">{subtext}</div>}
      </div>
    </div>
  );
};

export default DashboardCard;
