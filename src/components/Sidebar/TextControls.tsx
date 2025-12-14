import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { FaPlus, FaBold, FaItalic } from 'react-icons/fa';
import { useMeme } from '../../contexts/MemeContext';
import { COLORS, FONTS, TEXT_COLORS } from '../../constants/branding';

const TextControls: React.FC = () => {
  const { canvas, selectedObject } = useMeme();
  
  // Text-Eigenschaften
  const [text, setText] = useState('');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');

  // Aktualisiere Controls wenn Text ausgewählt wird
  useEffect(() => {
    if (selectedObject && selectedObject.type === 'i-text') {
      const textObj = selectedObject as fabric.IText;
      setText(textObj.text || '');
      setFontFamily(textObj.fontFamily || 'Inter');
      setFontSize(textObj.fontSize || 32);
      setTextColor(textObj.fill as string || '#FFFFFF');
      setStrokeColor(textObj.stroke as string || '#000000');
      setStrokeWidth(textObj.strokeWidth || 2);
      setIsBold(textObj.fontWeight === 'bold');
      setIsItalic(textObj.fontStyle === 'italic');
      setTextAlign(textObj.textAlign as 'left' | 'center' | 'right' || 'center');
    }
  }, [selectedObject]);

  const addText = () => {
    if (!canvas) return;

    const newText = new fabric.IText('Dein Text hier', {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fontFamily: fontFamily,
      fontSize: fontSize,
      fill: textColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textAlign: textAlign,
      originX: 'center',
      originY: 'center',
    });

    canvas.add(newText);
    canvas.setActiveObject(newText);
    canvas.requestRenderAll();
  };

  const updateSelectedText = (property: string, value: any) => {
    if (!canvas || !selectedObject || selectedObject.type !== 'i-text') return;

    const textObj = selectedObject as fabric.IText;
    (textObj as any)[property] = value;
    canvas.requestRenderAll();
  };

  const handleTextChange = (value: string) => {
    setText(value);
    if (selectedObject && selectedObject.type === 'i-text') {
      (selectedObject as fabric.IText).set('text', value);
      canvas?.requestRenderAll();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg" style={{ color: COLORS.text }}>
        Text hinzufügen
      </h3>

      {/* Add Text Button */}
      <button
        onClick={addText}
        className="w-full flex items-center justify-center gap-2 p-3 font-normal transition-all hover:opacity-90"
        style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
      >
        <FaPlus />
        Text hinzufügen
      </button>

      <div className="h-px bg-gray-200 my-4" />

      {/* Text bearbeiten (nur wenn Text ausgewählt) */}
      {selectedObject && selectedObject.type === 'i-text' && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm" style={{ color: COLORS.text }}>
            Text bearbeiten
          </h4>

          {/* Text Input */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: COLORS.text }}>
              Text
            </label>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
              rows={3}
              style={{ borderColor: '#e0e0e0' }}
            />
          </div>

          {/* Schriftart */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: COLORS.text }}>
              Schriftart
            </label>
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value);
                updateSelectedText('fontFamily', e.target.value);
              }}
              className="w-full p-2 border rounded-md text-sm"
              style={{ borderColor: '#e0e0e0' }}
            >
              {FONTS.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Schriftgröße */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: COLORS.text }}>
              Schriftgröße: {fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="120"
              value={fontSize}
              onChange={(e) => {
                const size = Number(e.target.value);
                setFontSize(size);
                updateSelectedText('fontSize', size);
              }}
              className="w-full"
            />
            <div className="flex gap-2 mt-1">
              {[16, 24, 32, 48, 64].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setFontSize(size);
                    updateSelectedText('fontSize', size);
                  }}
                  className="px-2 py-1 text-xs rounded border"
                  style={{
                    borderColor: fontSize === size ? COLORS.primary : '#e0e0e0',
                    backgroundColor: fontSize === size ? COLORS.primary : 'transparent',
                    color: fontSize === size ? COLORS.white : COLORS.text,
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Textfarbe */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: COLORS.text }}>
              Textfarbe
            </label>
            <div className="flex gap-2 mb-2">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setTextColor(color);
                    updateSelectedText('fill', color);
                  }}
                  className="w-8 h-8 rounded border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: textColor === color ? COLORS.primary : '#e0e0e0',
                  }}
                  title={color}
                />
              ))}
            </div>
            <input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                updateSelectedText('fill', e.target.value);
              }}
              className="w-full h-8 rounded border"
              style={{ borderColor: '#e0e0e0' }}
            />
          </div>

          {/* Umrandung (Stroke) */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: COLORS.text }}>
              Umrandung
            </label>
            <div className="flex gap-2 items-center mb-2">
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => {
                  setStrokeColor(e.target.value);
                  updateSelectedText('stroke', e.target.value);
                }}
                className="w-12 h-8 rounded border"
                style={{ borderColor: '#e0e0e0' }}
              />
              <input
                type="range"
                min="0"
                max="10"
                value={strokeWidth}
                onChange={(e) => {
                  const width = Number(e.target.value);
                  setStrokeWidth(width);
                  updateSelectedText('strokeWidth', width);
                }}
                className="flex-1"
              />
              <span className="text-xs" style={{ color: COLORS.text }}>{strokeWidth}px</span>
            </div>
          </div>

          {/* Text-Style */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: COLORS.text }}>
              Stil
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newBold = !isBold;
                  setIsBold(newBold);
                  updateSelectedText('fontWeight', newBold ? 'bold' : 'normal');
                }}
                className="flex-1 flex items-center justify-center gap-2 p-2 rounded border transition-all"
                style={{
                  borderColor: isBold ? COLORS.primary : '#e0e0e0',
                  backgroundColor: isBold ? COLORS.primary : 'transparent',
                  color: isBold ? COLORS.white : COLORS.text,
                }}
              >
                <FaBold />
                Fett
              </button>
              <button
                onClick={() => {
                  const newItalic = !isItalic;
                  setIsItalic(newItalic);
                  updateSelectedText('fontStyle', newItalic ? 'italic' : 'normal');
                }}
                className="flex-1 flex items-center justify-center gap-2 p-2 rounded border transition-all"
                style={{
                  borderColor: isItalic ? COLORS.primary : '#e0e0e0',
                  backgroundColor: isItalic ? COLORS.primary : 'transparent',
                  color: isItalic ? COLORS.white : COLORS.text,
                }}
              >
                <FaItalic />
                Kursiv
              </button>
            </div>
          </div>

          {/* Textausrichtung */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: COLORS.text }}>
              Ausrichtung
            </label>
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => {
                    setTextAlign(align);
                    updateSelectedText('textAlign', align);
                  }}
                  className="flex-1 p-2 rounded border text-xs font-medium transition-all capitalize"
                  style={{
                    borderColor: textAlign === align ? COLORS.primary : '#e0e0e0',
                    backgroundColor: textAlign === align ? COLORS.primary : 'transparent',
                    color: textAlign === align ? COLORS.white : COLORS.text,
                  }}
                >
                  {align === 'left' ? 'Links' : align === 'center' ? 'Mitte' : 'Rechts'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!selectedObject && (
        <p className="text-sm text-gray-500 text-center py-4">
          Füge einen Text hinzu oder wähle einen bestehenden Text aus, um ihn zu bearbeiten.
        </p>
      )}
    </div>
  );
};

export default TextControls;

