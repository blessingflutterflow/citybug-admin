'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoggingIn(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C2185B]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#C2185B] flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">CB</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">City Bug Admin</h1>
            <p className="text-gray-500 mt-1">Sign in to access the admin panel</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none"
                  placeholder="admin@citybug.app"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3 px-4 bg-[#C2185B] text-white font-medium rounded-full hover:bg-[#AD1457] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loggingIn ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Default admin credentials:</p>
              <p className="font-mono text-xs mt-1">admin@citybug.app / admin123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is logged in - show content with logout option
  return (
    <>
      {children}
      {/* Add logout button to sidebar or header */}
    </>
  );
}
