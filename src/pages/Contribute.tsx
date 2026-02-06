import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle } from 'lucide-react';
import { DEGREES, BRANCHES, SEMESTERS } from '../constants/categories';
import { submitResource } from '../lib/firebase';
import type { ResourceType } from '../types';

const RESOURCE_TYPES: { value: ResourceType; label: string }[] = [
  { value: 'pyqs', label: 'PYQs' },
  { value: 'notes', label: 'Notes' },
  { value: 'assignments', label: 'Assignment' },
  { value: 'solutions', label: 'Solution' },
];

export default function Contribute() {
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('notes');
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const branches = degree ? (BRANCHES[degree] || []) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!degree || !branch || !semester || !subject || !file) {
      setError('Please fill all required fields and upload a PDF.');
      return;
    }
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file.');
      return;
    }

    setLoading(true);
    try {
      await submitResource({
        degree,
        branch,
        semester: parseInt(semester, 10),
        subject,
        resourceType,
        file,
        submittedByName: name || undefined,
      });
      setSubmitted(true);
      setName('');
      setDegree('');
      setBranch('');
      setSemester('');
      setSubject('');
      setFile(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed.';
      setError(msg.includes('Firebase') ? 'Backend not configured. Add Firebase env variables.' : 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto px-4 py-16 text-center"
      >
        <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-full mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="font-display text-2xl font-bold text-stone-900">Thank you!</h2>
        <p className="mt-4 text-stone-600">
          Your resource has been submitted. It will be reviewed by our admin team before
          publishing.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
        >
          Submit another
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl font-bold text-stone-900"
      >
        Contribute
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-2 text-stone-600"
      >
        Share your resources to help fellow students
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700">
            Name (optional)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-stone-700">
            Degree *
          </label>
          <select
            id="degree"
            required
            value={degree}
            onChange={(e) => {
              setDegree(e.target.value);
              setBranch('');
            }}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select degree</option>
            {DEGREES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-stone-700">
            Branch *
          </label>
          <select
            id="branch"
            required
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            disabled={!degree}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="">Select branch</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="semester" className="block text-sm font-medium text-stone-700">
            Semester *
          </label>
          <select
            id="semester"
            required
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select semester</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={String(s)}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-stone-700">
            Subject *
          </label>
          <input
            id="subject"
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g. Data Structures"
          />
        </div>

        <div>
          <label htmlFor="resourceType" className="block text-sm font-medium text-stone-700">
            Resource type *
          </label>
          <select
            id="resourceType"
            required
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value as ResourceType)}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {RESOURCE_TYPES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">PDF upload *</label>
          <label className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
            <Upload className="w-10 h-10 text-stone-400" />
            <span className="mt-2 text-sm text-stone-600">
              {file ? file.name : 'Click to upload PDF'}
            </span>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </motion.button>
      </motion.form>
    </div>
  );
}
