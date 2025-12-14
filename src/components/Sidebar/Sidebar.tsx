import React from 'react';
import { FaImage, FaUpload, FaFont, FaFolder } from 'react-icons/fa';
import { useMeme } from '../../contexts/MemeContext';
import { COLORS } from '../../constants/branding';
import TemplateLibrary from './TemplateLibrary';
import ImageUpload from './ImageUpload';
import TextControls from './TextControls';
import SavedMemes from './SavedMemes';

const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useMeme();

  const tabs = [
    { id: 'templates' as const, label: 'Vorlagen', icon: FaImage },
    { id: 'upload' as const, label: 'Upload', icon: FaUpload },
    { id: 'text' as const, label: 'Text', icon: FaFont },
    { id: 'saved' as const, label: 'Gespeichert', icon: FaFolder },
  ];

  return (
    <div 
      className="w-64 md:w-80 flex flex-col border-r overflow-hidden"
      style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray }}
    >
      {/* Tab Navigation */}
      <div className="flex border-b" style={{ borderColor: '#e0e0e0' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-normal transition-all"
              style={{
                backgroundColor: isActive ? COLORS.white : 'transparent',
                color: isActive ? COLORS.primary : COLORS.gray,
                borderBottom: isActive ? `3px solid ${COLORS.primary}` : `1px solid ${COLORS.gray}`,
              }}
            >
              <Icon className="text-base mb-1" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'templates' && <TemplateLibrary />}
        {activeTab === 'upload' && <ImageUpload />}
        {activeTab === 'text' && <TextControls />}
        {activeTab === 'saved' && <SavedMemes />}
      </div>
    </div>
  );
};

export default Sidebar;

