import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink } from 'lucide-react';

type ResourceCardProps = {
  title: string;
  degree: string;
  branch: string;
  semester: number;
  subject: string;
  pdfUrl: string;
  fileName: string;
};

export default function ResourceCard({
  title,
  degree,
  branch,
  semester,
  subject,
  pdfUrl,
  fileName,
}: ResourceCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-stone-200 shadow-soft hover:shadow-soft-lg overflow-hidden transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-lg shrink-0">
            <FileText size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-stone-900 truncate" title={title}>
              {title || fileName}
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              {degree} • {branch} • Sem {semester} • {subject}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium transition-colors"
          >
            <ExternalLink size={16} />
            Preview
          </a>
          <a
            href={pdfUrl}
            download={fileName}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
          >
            <Download size={16} />
            Download
          </a>
        </div>
      </div>
    </motion.article>
  );
}
