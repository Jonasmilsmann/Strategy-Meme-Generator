import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useMeme } from '../../contexts/MemeContext';

const MemeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { canvas, setCanvas, setSelectedObject } = useMeme();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Canvas initialisieren
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    // Event Listener
    fabricCanvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    fabricCanvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeObject = fabricCanvas.getActiveObject();
      
      // Entf / Backspace - Löschen
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeObject) {
        fabricCanvas.remove(activeObject);
        fabricCanvas.discardActiveObject();
        fabricCanvas.requestRenderAll();
      }

      // Ctrl/Cmd + Z - Undo (später implementieren)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        // Undo-Funktionalität
      }

      // Ctrl/Cmd + C - Kopieren
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && activeObject) {
        e.preventDefault();
        activeObject.clone((cloned: fabric.Object) => {
          // Speichere für Einfügen
          (window as any)._clipboard = cloned;
        });
      }

      // Ctrl/Cmd + V - Einfügen
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        const clipboard = (window as any)._clipboard;
        if (clipboard) {
          clipboard.clone((cloned: fabric.Object) => {
            cloned.set({
              left: (clipboard.left || 0) + 10,
              top: (clipboard.top || 0) + 10,
              evented: true,
            });
            fabricCanvas.add(cloned);
            fabricCanvas.setActiveObject(cloned);
            fabricCanvas.requestRenderAll();
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    setCanvas(fabricCanvas);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      fabricCanvas.dispose();
      setCanvas(null);
    };
  }, [setCanvas, setSelectedObject]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} id="meme-canvas" />
    </div>
  );
};

export default MemeCanvas;

