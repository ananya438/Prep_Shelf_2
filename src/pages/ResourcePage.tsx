import { motion } from 'framer-motion';
import ResourceFilters from '../components/ResourceFilters';
import ResourceCard from '../components/ResourceCard';
import { useResources } from '../hooks/useResources';
import type { ResourceType } from '../types';

const TITLES: Record<ResourceType, string> = {
  pyqs: 'Previous Year Question Papers',
  notes: 'Notes',
  assignments: 'Assignments',
  solutions: 'Assignment Solutions',
};

type Props = { resourceType: ResourceType };

export default function ResourcePage({ resourceType }: Props) {
  const { resources, loading, filters, setFilters, subjects } = useResources(resourceType);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl font-bold text-stone-900"
      >
        {TITLES[resourceType]}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-2 text-stone-600"
      >
        Filter by degree, branch, semester, and subject
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 mb-8"
      >
        <ResourceFilters
          degree={filters.degree}
          branch={filters.branch}
          semester={filters.semester}
          subject={filters.subject}
          subjects={subjects}
          onDegreeChange={(v) => setFilters((f) => ({ ...f, degree: v }))}
          onBranchChange={(v) => setFilters((f) => ({ ...f, branch: v }))}
          onSemesterChange={(v) => setFilters((f) => ({ ...f, semester: v }))}
          onSubjectChange={(v) => setFilters((f) => ({ ...f, subject: v }))}
        />
      </motion.div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-stone-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl border border-stone-200"
        >
          <p className="text-stone-600">No resources found. Try adjusting filters or contribute.</p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {resources.map((r) => (
            <motion.div key={r.id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
              <ResourceCard
                title={r.title}
                degree={r.degree}
                branch={r.branch}
                semester={r.semester}
                subject={r.subject}
                pdfUrl={r.pdfUrl}
                fileName={r.fileName}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
