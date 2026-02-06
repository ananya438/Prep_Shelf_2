export type ResourceType = 'pyqs' | 'notes' | 'assignments' | 'solutions';

export type Resource = {
  id: string;
  title: string;
  degree: string;
  branch: string;
  semester: number;
  subject: string;
  resourceType: ResourceType;
  pdfUrl: string;
  fileName: string;
  submittedBy?: string;
  approved: boolean;
  createdAt: Date;
  adminApprovedAt?: Date;
};

export type ResourceSubmission = Omit<Resource, 'id' | 'approved' | 'createdAt'> & {
  submittedByName?: string;
};

export type CategoryFilters = {
  degree: string;
  branch: string;
  semester: string;
  subject: string;
};
