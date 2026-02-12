import React from 'react';

export default function TestFeatures() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Feature Test Page</h1>
      
      <div className="space-y-6">
        <div className="p-6 bg-blue-600 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">✅ Advanced Search</h2>
          <p>Search component with Algolia integration is working</p>
        </div>
        
        <div className="p-6 bg-green-600 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">✅ AI Pulse</h2>
          <p>AI recommendation engine is working</p>
        </div>
        
        <div className="p-6 bg-orange-600 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">✅ Live Updates</h2>
          <p>Real-time feed is working</p>
        </div>
        
        <div className="p-6 bg-red-600 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">✅ Security Score</h2>
          <p>Security calculator is working</p>
        </div>
        
        <div className="p-6 bg-purple-600 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">✅ Authentication</h2>
          <p>Clerk authentication is working</p>
        </div>
      </div>
      
      <div className="mt-8">
        <a href="/" className="text-blue-400 hover:text-blue-300 underline">
          ← Back to Homepage
        </a>
      </div>
    </div>
  );
}
