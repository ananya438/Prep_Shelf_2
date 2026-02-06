import { useState, useEffect, useMemo } from 'react';
import type { Resource, ResourceType } from '../types';
import { getApprovedResources } from '../lib/firebase';

export function useResources(resourceType: ResourceType) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    degree: '',
    branch: '',
    semester: '',
    subject: '',
  });

  useEffect(() => {
    const unsub = getApprovedResources(resourceType, (data) => {
      setResources(data);
      setLoading(false);
    });
    return () => unsub?.();
  }, [resourceType]);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (filters.degree && r.degree !== filters.degree) return false;
      if (filters.branch && r.branch !== filters.branch) return false;
      if (filters.semester && String(r.semester) !== filters.semester) return false;
      if (filters.subject && r.subject !== filters.subject) return false;
      return true;
    });
  }, [resources, filters]);

  const subjects = useMemo(() => {
    const set = new Set<string>();
    resources.forEach((r) => set.add(r.subject));
    return Array.from(set).sort();
  }, [resources]);

  return { resources: filtered, loading, filters, setFilters, subjects };
}
