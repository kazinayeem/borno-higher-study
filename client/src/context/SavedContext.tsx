import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.js';

interface SavedContextType {
  savedUniversityIds: string[];
  savedScholarshipIds: string[];
  toggleSaveUniversity: (id: string) => void;
  toggleSaveScholarship: (id: string) => void;
  isUniversitySaved: (id: string) => boolean;
  isScholarshipSaved: (id: string) => boolean;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export const SavedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [savedUniversityIds, setSavedUniversityIds] = useState<string[]>(() => {
    const s = localStorage.getItem('borno_saved_unis');
    return s ? JSON.parse(s) : ['uni-aalto', 'uni-tum'];
  });

  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>(() => {
    const s = localStorage.getItem('borno_saved_schs');
    return s ? JSON.parse(s) : ['sch-finland-gov', 'sch-daad-epos'];
  });

  useEffect(() => {
    localStorage.setItem('borno_saved_unis', JSON.stringify(savedUniversityIds));
  }, [savedUniversityIds]);

  useEffect(() => {
    localStorage.setItem('borno_saved_schs', JSON.stringify(savedScholarshipIds));
  }, [savedScholarshipIds]);

  const toggleSaveUniversity = (id: string) => {
    setSavedUniversityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

    if (token) {
      fetch('/api/auth/saved-universities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ universityId: id }),
      }).catch((e) => console.warn('Could not sync bookmark with server', e));
    }
  };

  const toggleSaveScholarship = (id: string) => {
    setSavedScholarshipIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

    if (token) {
      fetch('/api/auth/saved-scholarships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scholarshipId: id }),
      }).catch((e) => console.warn('Could not sync bookmark with server', e));
    }
  };

  const isUniversitySaved = (id: string) => savedUniversityIds.includes(id);
  const isScholarshipSaved = (id: string) => savedScholarshipIds.includes(id);

  return (
    <SavedContext.Provider
      value={{
        savedUniversityIds,
        savedScholarshipIds,
        toggleSaveUniversity,
        toggleSaveScholarship,
        isUniversitySaved,
        isScholarshipSaved,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used within a SavedProvider');
  return ctx;
};
