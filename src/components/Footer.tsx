import { motion } from 'framer-motion';
import { Instagram, Mail, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white border-t border-stone-200 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <Link to="/" className="font-display font-bold text-lg text-stone-900">
              PrepShelf
            </Link>
            <p className="mt-1 text-sm text-stone-500">
              Helping university students succeed
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/prepshelf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-stone-600 hover:text-primary-600 transition-colors focus-ring rounded-lg p-2"
              aria-label="Follow us on Instagram"
            >
              <Instagram size={20} />
              <span className="text-sm font-medium">Instagram</span>
            </a>
            <a
              href="mailto:contact@prepshelf.com"
              className="flex items-center gap-2 text-stone-600 hover:text-primary-600 transition-colors focus-ring rounded-lg p-2"
              aria-label="Contact us via email"
            >
              <Mail size={20} />
              <span className="text-sm font-medium">contact@prepshelf.com</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-stone-500">
          <p>© {new Date().getFullYear()} PrepShelf. Built for students, by students.</p>
          <Link
            to="/admin"
            className="flex items-center gap-1 text-stone-500 hover:text-primary-600 transition-colors"
          >
            <Shield size={16} />
            Admin
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}
