import React, { createContext, useContext, useState, ReactNode } from 'react';
import { fabric } from 'fabric';

interface MemeContextType {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  selectedObject: fabric.Object | null;
  setSelectedObject: (obj: fabric.Object | null) => void;
  activeTab: 'templates' | 'upload' | 'text' | 'saved';
  setActiveTab: (tab: 'templates' | 'upload' | 'text' | 'saved') => void;
}

const MemeContext = createContext<MemeContextType>({
  canvas: null,
  setCanvas: () => {},
  selectedObject: null,
  setSelectedObject: () => {},
  activeTab: 'templates',
  setActiveTab: () => {},
});

export const useMeme = () => useContext(MemeContext);

interface MemeProviderProps {
  children: ReactNode;
}

export const MemeProvider: React.FC<MemeProviderProps> = ({ children }) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'upload' | 'text' | 'saved'>('templates');

  return (
    <MemeContext.Provider 
      value={{ 
        canvas, 
        setCanvas, 
        selectedObject, 
        setSelectedObject,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </MemeContext.Provider>
  );
};

