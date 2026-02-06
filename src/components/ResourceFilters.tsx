import { DEGREES, BRANCHES, SEMESTERS } from '../constants/categories';

type Props = {
  degree: string;
  branch: string;
  semester: string;
  subject: string;
  subjects: string[];
  onDegreeChange: (v: string) => void;
  onBranchChange: (v: string) => void;
  onSemesterChange: (v: string) => void;
  onSubjectChange: (v: string) => void;
};

export default function ResourceFilters({
  degree,
  branch,
  semester,
  subject,
  subjects,
  onDegreeChange,
  onBranchChange,
  onSemesterChange,
  onSubjectChange,
}: Props) {
  const branches = degree ? (BRANCHES[degree] || []) : [];

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl border border-stone-200 shadow-soft">
      <select
        value={degree}
        onChange={(e) => {
          onDegreeChange(e.target.value);
          onBranchChange('');
          onSubjectChange('');
        }}
        className="px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        aria-label="Filter by degree"
      >
        <option value="">All Degrees</option>
        {DEGREES.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <select
        value={branch}
        onChange={(e) => {
          onBranchChange(e.target.value);
          onSubjectChange('');
        }}
        disabled={!degree}
        className="px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
        aria-label="Filter by branch"
      >
        <option value="">All Branches</option>
        {branches.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <select
        value={semester}
        onChange={(e) => onSemesterChange(e.target.value)}
        className="px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        aria-label="Filter by semester"
      >
        <option value="">All Semesters</option>
        {SEMESTERS.map((s) => (
          <option key={s} value={String(s)}>
            Semester {s}
          </option>
        ))}
      </select>

      <select
        value={subject}
        onChange={(e) => onSubjectChange(e.target.value)}
        className="px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        aria-label="Filter by subject"
      >
        <option value="">All Subjects</option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
