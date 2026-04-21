'use client';

import { useState, useEffect } from 'react';
import { getAllUsers, UserProfile } from '@/lib/services/userService';
import { banUser, unbanUser, isUserBanned } from '@/lib/services/banService';

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    
    // Check ban status for each user
    const bannedSet = new Set<string>();
    for (const user of data) {
      const banned = await isUserBanned(user.uid);
      if (banned) bannedSet.add(user.uid);
    }
    setBannedUsers(bannedSet);
    
    setLoading(false);
  }

  async function handleBanUser(userId: string) {
    setActionLoading(userId);
    const success = await banUser(userId, 'Banned by admin');
    if (success) {
      setBannedUsers(prev => new Set([...prev, userId]));
    }
    setActionLoading(null);
  }

  async function handleUnbanUser(userId: string) {
    setActionLoading(userId);
    const success = await unbanUser(userId);
    if (success) {
      setBannedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
    setActionLoading(null);
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.includes(searchQuery)
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">{users.length} total users | {bannedUsers.size} banned</p>
        </div>
        
        {/* Search */}
        <div className="relative max-w-sm">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none transition-colors"
          />
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-48 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12.375 4.25a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
            </svg>
            <p className="mt-4 text-gray-500">No users found</p>
            {searchQuery && (
              <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const isBanned = bannedUsers.has(user.uid);
                  return (
                    <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${isBanned ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.photoUrl ? (
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={user.photoUrl} 
                                alt={user.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-[#C2185B]/10 flex items-center justify-center">
                                <span className="text-[#C2185B] font-medium">
                                  {user.name?.charAt(0).toUpperCase() || '?'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{user.uid.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          isBanned 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isBanned ? (
                          <button
                            onClick={() => handleUnbanUser(user.uid)}
                            disabled={actionLoading === user.uid}
                            className="text-green-600 hover:text-green-800 font-medium text-sm disabled:opacity-50"
                          >
                            {actionLoading === user.uid ? 'Processing...' : 'Unban'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBanUser(user.uid)}
                            disabled={actionLoading === user.uid}
                            className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50"
                          >
                            {actionLoading === user.uid ? 'Processing...' : 'Ban User'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
