import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthDebug = () => {
  const [authInfo, setAuthInfo] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAuthInfo = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('email');
      const fullname = localStorage.getItem('fullname');

      setAuthInfo({
        token: token ? `${token.substring(0, 20)}...` : 'Not found',
        fullToken: token,
        role,
        userId,
        email,
        fullname,
        hasToken: !!token,
        tokenLength: token ? token.length : 0
      });
    };

    getAuthInfo();
  }, []);

  const testEndpoint = async (endpoint) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(endpoint);
      setTestResult({
        success: true,
        status: response.status,
        data: response.data,
        endpoint
      });
    } catch (error) {
      setTestResult({
        success: false,
        status: error.response?.status,
        message: error.message,
        error: error.response?.data,
        endpoint
      });
    }
    setLoading(false);
  };

  const decodeJWT = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      return { error: 'Invalid token format' };
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Authentication Debug</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Local Storage Info:</h3>
        <div className="bg-white p-4 rounded border">
          <div><strong>Has Token:</strong> {authInfo.hasToken ? 'Yes' : 'No'}</div>
          <div><strong>Token Length:</strong> {authInfo.tokenLength}</div>
          <div><strong>Token Preview:</strong> {authInfo.token}</div>
          <div><strong>Role:</strong> {authInfo.role || 'Not set'}</div>
          <div><strong>User ID:</strong> {authInfo.userId || 'Not set'}</div>
          <div><strong>Email:</strong> {authInfo.email || 'Not set'}</div>
          <div><strong>Full Name:</strong> {authInfo.fullname || 'Not set'}</div>
        </div>
      </div>

      {authInfo.fullToken && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">JWT Token Payload:</h3>
          <div className="bg-white p-4 rounded border">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(decodeJWT(authInfo.fullToken), null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Test Endpoints:</h3>
        <div className="space-x-2 mb-4 flex flex-wrap gap-2">
          <button 
            onClick={() => testEndpoint('/api/students/my')}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test /api/students/my
          </button>
          <button 
            onClick={() => testEndpoint('/api/students')}
            disabled={loading}
            className="px-4 py-2 bg-blue-300 text-white rounded hover:bg-blue-400 disabled:opacity-50"
          >
            Test /api/students
          </button>
          <button 
            onClick={() => testEndpoint('/api/users/me')}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test /api/users/me
          </button>
          <button 
            onClick={() => testEndpoint('/api/health-events')}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Test /api/health-events
          </button>
          <button 
            onClick={() => testEndpoint('/api/health-info')}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            Test /api/health-info
          </button>
        </div>
        
        {loading && <div className="text-blue-500">Testing...</div>}
        
        {testResult && (
          <div className={`p-4 rounded border ${testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div><strong>Endpoint:</strong> {testResult.endpoint}</div>
            <div><strong>Status:</strong> {testResult.status}</div>
            {testResult.success ? (
              <div><strong>Success:</strong> <pre className="text-sm mt-2">{JSON.stringify(testResult.data, null, 2)}</pre></div>
            ) : (
              <div>
                <div><strong>Error:</strong> {testResult.message}</div>
                {testResult.error && <pre className="text-sm mt-2">{JSON.stringify(testResult.error, null, 2)}</pre>}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear All & Reload (Logout)
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;
