import React from 'react';

export default function EditMyProfile() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-gray-50 rounded-t-lg px-6 py-4 border border-b-0 border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              defaultValue="admin@email.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              defaultValue="12345678"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* First Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="Demo"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Last Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="Admin"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="mt-6">
          <button className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}