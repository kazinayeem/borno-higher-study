import React, { createContext, useContext, useState, useEffect } from 'react';

interface CompareContextType {
  compareSlugs: string[];
  addToCompare: (slug: string) => boolean;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
  isInCompare: (slug: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareSlugs, setCompareSlugs] = useState<string[]>(() => {
    const saved = localStorage.getItem('borno_compare_slugs');
    return saved ? JSON.parse(saved) : ['aalto-university', 'technical-university-of-munich'];
  });

  useEffect(() => {
    localStorage.setItem('borno_compare_slugs', JSON.stringify(compareSlugs));
  }, [compareSlugs]);

  const addToCompare = (slug: string): boolean => {
    if (compareSlugs.includes(slug)) return false;
    if (compareSlugs.length >= 4) {
      alert('You can compare a maximum of 4 universities simultaneously.');
      return false;
    }
    setCompareSlugs((prev) => [...prev, slug]);
    return true;
  };

  const removeFromCompare = (slug: string) => {
    setCompareSlugs((prev) => prev.filter((s) => s !== slug));
  };

  const clearCompare = () => {
    setCompareSlugs([]);
  };

  const isInCompare = (slug: string) => compareSlugs.includes(slug);

  return (
    <CompareContext.Provider
      value={{
        compareSlugs,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within a CompareProvider');
  return ctx;
};
