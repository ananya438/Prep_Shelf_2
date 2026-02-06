export const DEGREES = [
  'B.Tech',
  'BBA',
  'BBA LLB',
  'MBA',
  'BCA',
  'MCA',
  'B.Sc',
  'M.Sc',
] as const;

export const BRANCHES: Record<string, string[]> = {
  'B.Tech': ['CSE', 'Petroleum', 'Mechanical', 'Civil', 'ECE', 'EEE', 'Chemical', 'IT'],
  'BBA': ['General'],
  'BBA LLB': ['General'],
  'MBA': ['General', 'Finance', 'Marketing', 'HR'],
  'BCA': ['General'],
  'MCA': ['General'],
  'B.Sc': ['Maths', 'Physics', 'Chemistry', 'Computer Science'],
  'M.Sc': ['Maths', 'Physics', 'Chemistry', 'Computer Science'],
};

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
