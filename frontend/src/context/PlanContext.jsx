import { createContext, useContext, useState } from 'react';

const PlanContext = createContext();

export function PlanProvider({ children }) {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <PlanContext.Provider value={{ currentPlan, setCurrentPlan, isLoading, setIsLoading }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
