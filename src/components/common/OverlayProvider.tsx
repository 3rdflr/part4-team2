'use client';
import React, { createContext, useState, ReactNode, useCallback } from 'react';

interface OverlayContextValue {
  mount: (id: string, element: ReactNode) => void;
  unmount: (id: string) => void;
}

export const OverlayContext = createContext<OverlayContextValue | null>(null);

export const OverlayProvider = ({ children }: { children: ReactNode }) => {
  const [overlayId, setOverlayId] = useState<Map<string, ReactNode>>(new Map());

  const mount = useCallback((id: string, element: ReactNode) => {
    setOverlayId((overlayId) => {
      const copy = new Map(overlayId);
      copy.set(id, element);
      return copy;
    });
  }, []);

  const unmount = useCallback((id: string) => {
    setOverlayId((overlayId) => {
      const copy = new Map(overlayId);
      copy.delete(id);
      return copy;
    });
  }, []);

  return (
    <OverlayContext.Provider value={{ mount, unmount }}>
      {children}
      {[...overlayId.entries()].map(([id, element]) => (
        <React.Fragment key={id}>{element}</React.Fragment>
      ))}
    </OverlayContext.Provider>
  );
};
