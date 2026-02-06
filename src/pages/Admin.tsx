import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, LogIn, LogOut, RefreshCw } from 'lucide-react';
import { auth, signInWithEmailAndPassword, getPendingResources } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import type { Resource } from '../types';

export default function Admin() {
  const [user, setUser] = useState(auth.currentUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) loadPending();
  }, [user]);

  const loadPending = async () => {
    try {
      const data = await getPendingResources();
      setPending(data);
    } catch (e) {
      setPending([]);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      setAuthError((err as { message?: string })?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    const db = getFirestore();
    await updateDoc(doc(db, 'resources', id), { approved: true, adminApprovedAt: new Date() });
    setPending((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReject = async (id: string) => {
    const db = getFirestore();
    await updateDoc(doc(db, 'resources', id), { approved: false });
    setPending((prev) => prev.filter((r) => r.id !== id));
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl font-bold text-stone-900 mb-6"
        >
          Admin Login
        </motion.h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            required
            className="w-full px-4 py-2 rounded-lg border border-stone-200"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 rounded-lg border border-stone-200"
          />
          {authError && <p className="text-red-600 text-sm">{authError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 w-full justify-center py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
          >
            <LogIn size={18} />
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl font-bold text-stone-900"
        >
          Admin Panel
        </motion.h1>
        <div className="flex gap-2">
          <button
            onClick={loadPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <button
            onClick={() => auth.signOut()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <h2 className="font-semibold text-stone-800">Pending resources ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-stone-500 py-8">No pending submissions.</p>
        ) : (
          pending.map((r) => (
            <div
              key={r.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-stone-200"
            >
              <div>
                <p className="font-medium">{r.title || r.fileName}</p>
                <p className="text-sm text-stone-500">
                  {r.degree} • {r.branch} • Sem {r.semester} • {r.subject} • {r.resourceType}
                </p>
                {r.submittedBy && (
                  <p className="text-xs text-stone-400">By: {r.submittedBy}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href={r.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-sm"
                >
                  View PDF
                </a>
                <button
                  onClick={() => handleApprove(r.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                >
                  <Check size={16} />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(r.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                >
                  <X size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
}
