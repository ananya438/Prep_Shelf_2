import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileQuestion, BookOpen, ClipboardList, FileCheck } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../constants/quotes';

const CARDS = [
  {
    title: 'PYQs',
    description: 'Previous year question papers to ace your exams',
    path: '/pyqs',
    icon: FileQuestion,
    color: 'primary',
  },
  {
    title: 'Notes',
    description: 'Comprehensive subject notes and study material',
    path: '/notes',
    icon: BookOpen,
    color: 'accent',
  },
  {
    title: 'Assignments',
    description: 'Assignment questions and practice problems',
    path: '/assignments',
    icon: ClipboardList,
    color: 'emerald',
  },
  {
    title: 'Solutions',
    description: 'Assignment solutions and worked examples',
    path: '/solutions',
    icon: FileCheck,
    color: 'amber',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[idx]);
  }, []);

  return (
    <div>
      {/* Motivational quote */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-primary-50 to-accent-50 py-8 px-4 text-center border-b border-stone-200"
      >
        <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium text-stone-700 italic">
          &ldquo;{quote}&rdquo;
        </p>
      </motion.section>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900"
        >
          Your University Resource Hub
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-stone-600 max-w-2xl mx-auto"
        >
          Access PYQs, notes, assignments, and solutions—all in one place. Filter by degree,
          branch, semester, and subject. Contribute and help fellow students.
        </motion.p>
      </section>

      {/* Resource cards */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {CARDS.map((card, i) => (
            <motion.div key={card.title} variants={item}>
              <Link to={card.path}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="h-full p-6 rounded-2xl bg-white border border-stone-200 shadow-soft hover:shadow-soft-lg transition-shadow focus-ring rounded-2xl"
                >
                  <div
                    className={`inline-flex p-3 rounded-xl ${
                      card.color === 'primary'
                        ? 'bg-primary-100 text-primary-600'
                        : card.color === 'accent'
                          ? 'bg-accent-100 text-accent-500'
                          : card.color === 'emerald'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    <card.icon size={28} />
                  </div>
                  <h3 className="mt-4 font-display font-semibold text-lg text-stone-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600">{card.description}</p>
                  <span
                    className={`mt-4 inline-block text-sm font-medium ${
                      card.color === 'primary'
                        ? 'text-primary-600'
                        : card.color === 'accent'
                          ? 'text-accent-500'
                          : card.color === 'emerald'
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                    }`}
                  >
                    Browse →
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
