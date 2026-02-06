import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl font-bold text-stone-900"
      >
        About PrepShelf
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-8 space-y-6 text-stone-600 leading-relaxed"
      >
        <p>
          PrepShelf is a student-driven platform designed to help university students access and
          share academic resources—PYQs, notes, assignments, and solutions—all in one place.
        </p>
        <p>
          Our goal is simple: make quality study material easy to find, filter by degree, branch,
          semester, and subject, and encourage students to contribute their own resources to help
          peers succeed.
        </p>
        <p>
          Built for students, by students. Together we can make exam prep and coursework easier
          for everyone.
        </p>
      </motion.div>
    </div>
  );
}
