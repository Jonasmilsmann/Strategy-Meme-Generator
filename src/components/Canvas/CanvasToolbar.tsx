import React from 'react';
import { FaTrash, FaArrowUp, FaArrowDown, FaCopy } from 'react-icons/fa';
import { useMeme } from '../../contexts/MemeContext';
import { COLORS } from '../../constants/branding';

const CanvasToolbar: React.FC = () => {
  const { canvas, selectedObject } = useMeme();

  const deleteSelected = () => {
    if (canvas && selectedObject) {
      canvas.remove(selectedObject);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  };

  const bringForward = () => {
    if (canvas && selectedObject) {
      canvas.bringForward(selectedObject);
      canvas.requestRenderAll();
    }
  };

  const sendBackward = () => {
    if (canvas && selectedObject) {
      canvas.sendBackwards(selectedObject);
      canvas.requestRenderAll();
    }
  };

  const duplicateSelected = () => {
    if (canvas && selectedObject) {
      selectedObject.clone((cloned: fabric.Object) => {
        cloned.set({
          left: (selectedObject.left || 0) + 10,
          top: (selectedObject.top || 0) + 10,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
      });
    }
  };

  const toolbarButtons = [
    { icon: FaTrash, label: 'Löschen', onClick: deleteSelected, disabled: !selectedObject },
    { icon: FaCopy, label: 'Duplizieren', onClick: duplicateSelected, disabled: !selectedObject },
    { icon: FaArrowUp, label: 'Nach vorne', onClick: bringForward, disabled: !selectedObject },
    { icon: FaArrowDown, label: 'Nach hinten', onClick: sendBackward, disabled: !selectedObject },
  ];

  return (
    <div 
      className="h-14 flex items-center justify-center gap-2 px-4 border-b"
      style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray }}
    >
      {toolbarButtons.map((button, index) => {
        const Icon = button.icon;
        return (
          <button
            key={index}
            onClick={button.onClick}
            disabled={button.disabled}
            className="flex items-center gap-2 px-3 py-2 font-normal text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{
              backgroundColor: COLORS.white,
              color: COLORS.gray,
              border: `1px solid ${COLORS.gray}`,
            }}
            title={button.label}
          >
            <Icon />
            <span className="hidden md:inline">{button.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CanvasToolbar;

