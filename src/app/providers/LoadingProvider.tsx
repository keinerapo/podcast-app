import { createContext, useContext, useState, type ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsLoading: (loading: boolean) => void;
}

/**
 * LoadingContext
 * Context for managing global loading state
 * Used to display loading indicators when fetching data
 */
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

/**
 * LoadingProvider Component
 * Provides loading state to all child components
 */
export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const value: LoadingContextType = {
    isLoading,
    setIsLoading,
  };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

/**
 * Custom hook to access loading context
 * @returns LoadingContextType with isLoading state and setIsLoading setter
 */
export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);

  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }

  return context;
}
