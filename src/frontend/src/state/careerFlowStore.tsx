import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CareerFlowState {
  domain: string | null;
  jobRole: string | null;
  customJobRole: string | null;
  setDomain: (domain: string) => void;
  setJobRole: (role: string) => void;
  setCustomJobRole: (role: string) => void;
  clearFlow: () => void;
}

const CareerFlowContext = createContext<CareerFlowState | undefined>(undefined);

const STORAGE_KEY = 'vidyamitra_career_flow';

export function CareerFlowProvider({ children }: { children: ReactNode }) {
  const [domain, setDomainState] = useState<string | null>(null);
  const [jobRole, setJobRoleState] = useState<string | null>(null);
  const [customJobRole, setCustomJobRoleState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDomainState(parsed.domain || null);
        setJobRoleState(parsed.jobRole || null);
        setCustomJobRoleState(parsed.customJobRole || null);
      } catch (e) {
        console.error('Failed to parse career flow state', e);
      }
    }
  }, []);

  const saveToStorage = (data: { domain: string | null; jobRole: string | null; customJobRole: string | null }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const setDomain = (newDomain: string) => {
    setDomainState(newDomain);
    saveToStorage({ domain: newDomain, jobRole, customJobRole });
  };

  const setJobRole = (role: string) => {
    setJobRoleState(role);
    saveToStorage({ domain, jobRole: role, customJobRole });
  };

  const setCustomJobRole = (role: string) => {
    setCustomJobRoleState(role);
    saveToStorage({ domain, jobRole, customJobRole: role });
  };

  const clearFlow = () => {
    setDomainState(null);
    setJobRoleState(null);
    setCustomJobRoleState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CareerFlowContext.Provider
      value={{
        domain,
        jobRole,
        customJobRole,
        setDomain,
        setJobRole,
        setCustomJobRole,
        clearFlow,
      }}
    >
      {children}
    </CareerFlowContext.Provider>
  );
}

export function useCareerFlow() {
  const context = useContext(CareerFlowContext);
  if (!context) {
    throw new Error('useCareerFlow must be used within CareerFlowProvider');
  }
  return context;
}
