import React from 'react';
import { Dropdown, Avatar, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (key === 'signout') {
      localStorage.clear();
      navigate('/login');
    }
  };

  const items = [
    { key: 'profile', label: 'Your Profile' },
    { key: 'settings', label: 'Settings' },
    { key: 'signout', label: 'Sign out' }
  ];

  return (
    <div
      style={{
        backgroundColor: '#1b2735',
        height: '80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
      }}
    >
      <div style={{ color: 'white', fontSize: '24px' }}>Dashboard</div>
      <div>
        <Dropdown
          menu={{
            items,
            onClick: handleMenuClick
          }}
          placement="bottomRight"
        >
          <Space>
            <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" size={50} />
          </Space>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
