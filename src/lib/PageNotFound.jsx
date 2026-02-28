import React from 'react';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 mb-6">Page not found.</p>
        <Link to="/" className="px-4 py-2 bg-[#A51C30] text-white rounded-lg text-sm font-medium">
          Go Home
        </Link>
      </div>
    </div>
  );
}
