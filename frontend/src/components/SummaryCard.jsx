import React from 'react';

const cardStyle = {
  flex: '1',
  padding: '1rem',
  margin: '0.5rem',
  borderRadius: '12px',
  backgroundColor: '#f3f4f6',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  textAlign: 'center',
  minWidth: '120px',
};

const iconStyle = {
  fontSize: '1.5rem',
  marginBottom: '0.5rem',
};

const SummaryCard = ({ title, value, unit, Icon, color }) => {
  return (
    <div style={{ ...cardStyle, borderTop: `4px solid ${color}` }}>
      <div style={{ ...iconStyle, color: color }}>
        <Icon />
      </div>
      <h4>{title}</h4>
      <p>
        <strong>{value}</strong> {unit}
      </p>
    </div>
  );
};

export default SummaryCard;
