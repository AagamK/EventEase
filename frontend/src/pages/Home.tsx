import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">EventEase</h1>
        <p className="text-lg text-gray-600 mb-8">AI-Powered Event Planning</p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;