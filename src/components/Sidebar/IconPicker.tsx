import React, { useState } from 'react';
import { fabric } from 'fabric';
import { 
  FaSmile, FaLaugh, FaGrin, FaMeh, FaFrown, FaSurprise,
  FaThumbsUp, FaThumbsDown, FaHeart, FaStar, FaFire, FaBolt,
  FaCheck, FaTimes, FaExclamation, FaQuestion, FaInfoCircle,
  FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight,
  FaPlus, FaMinus, FaEquals, FaDollarSign, FaPercent,
  FaChartLine, FaChartBar, FaBriefcase, FaUsers, FaUserTie,
  FaLightbulb, FaRocket, FaTrophy, FaGem, FaGift,
  FaPhone, FaEnvelope, FaHome, FaBuilding, FaGlobe,
  FaClock, FaCalendar, FaMapMarkerAlt, FaCamera, FaMusic
} from 'react-icons/fa';
import { useMeme } from '../../contexts/MemeContext';
import { COLORS, ICON_COLORS } from '../../constants/branding';

interface IconItem {
  name: string;
  icon: React.ComponentType<any>;
  category: string;
}

const IconPicker: React.FC = () => {
  const { canvas } = useMeme();
  const [selectedColor, setSelectedColor] = useState('#FF6600');
  const [iconSize, setIconSize] = useState(48);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const iconLibrary: IconItem[] = [
    // Emoticons
    { name: 'Smile', icon: FaSmile, category: 'emoticons' },
    { name: 'Laugh', icon: FaLaugh, category: 'emoticons' },
    { name: 'Grin', icon: FaGrin, category: 'emoticons' },
    { name: 'Meh', icon: FaMeh, category: 'emoticons' },
    { name: 'Frown', icon: FaFrown, category: 'emoticons' },
    { name: 'Surprise', icon: FaSurprise, category: 'emoticons' },
    
    // Reactions
    { name: 'Thumbs Up', icon: FaThumbsUp, category: 'reactions' },
    { name: 'Thumbs Down', icon: FaThumbsDown, category: 'reactions' },
    { name: 'Heart', icon: FaHeart, category: 'reactions' },
    { name: 'Star', icon: FaStar, category: 'reactions' },
    { name: 'Fire', icon: FaFire, category: 'reactions' },
    { name: 'Bolt', icon: FaBolt, category: 'reactions' },
    
    // Symbols
    { name: 'Check', icon: FaCheck, category: 'symbols' },
    { name: 'Times', icon: FaTimes, category: 'symbols' },
    { name: 'Exclamation', icon: FaExclamation, category: 'symbols' },
    { name: 'Question', icon: FaQuestion, category: 'symbols' },
    { name: 'Info', icon: FaInfoCircle, category: 'symbols' },
    
    // Arrows
    { name: 'Arrow Up', icon: FaArrowUp, category: 'arrows' },
    { name: 'Arrow Down', icon: FaArrowDown, category: 'arrows' },
    { name: 'Arrow Left', icon: FaArrowLeft, category: 'arrows' },
    { name: 'Arrow Right', icon: FaArrowRight, category: 'arrows' },
    
    // Math
    { name: 'Plus', icon: FaPlus, category: 'math' },
    { name: 'Minus', icon: FaMinus, category: 'math' },
    { name: 'Equals', icon: FaEquals, category: 'math' },
    { name: 'Dollar', icon: FaDollarSign, category: 'math' },
    { name: 'Percent', icon: FaPercent, category: 'math' },
    
    // Business
    { name: 'Chart Line', icon: FaChartLine, category: 'business' },
    { name: 'Chart Bar', icon: FaChartBar, category: 'business' },
    { name: 'Briefcase', icon: FaBriefcase, category: 'business' },
    { name: 'Users', icon: FaUsers, category: 'business' },
    { name: 'User Tie', icon: FaUserTie, category: 'business' },
    { name: 'Lightbulb', icon: FaLightbulb, category: 'business' },
    { name: 'Rocket', icon: FaRocket, category: 'business' },
    { name: 'Trophy', icon: FaTrophy, category: 'business' },
    { name: 'Gem', icon: FaGem, category: 'business' },
    { name: 'Gift', icon: FaGift, category: 'business' },
    
    // Contact
    { name: 'Phone', icon: FaPhone, category: 'contact' },
    { name: 'Envelope', icon: FaEnvelope, category: 'contact' },
    { name: 'Home', icon: FaHome, category: 'contact' },
    { name: 'Building', icon: FaBuilding, category: 'contact' },
    { name: 'Globe', icon: FaGlobe, category: 'contact' },
    { name: 'Clock', icon: FaClock, category: 'contact' },
    { name: 'Calendar', icon: FaCalendar, category: 'contact' },
    { name: 'Map Marker', icon: FaMapMarkerAlt, category: 'contact' },
    { name: 'Camera', icon: FaCamera, category: 'contact' },
    { name: 'Music', icon: FaMusic, category: 'contact' },
  ];

  const categories = [
    { id: 'all', label: 'Alle' },
    { id: 'emoticons', label: 'Emoticons' },
    { id: 'reactions', label: 'Reaktionen' },
    { id: 'symbols', label: 'Symbole' },
    { id: 'arrows', label: 'Pfeile' },
    { id: 'math', label: 'Zeichen' },
    { id: 'business', label: 'Business' },
    { id: 'contact', label: 'Kontakt' },
  ];

  const filteredIcons = selectedCategory === 'all' 
    ? iconLibrary 
    : iconLibrary.filter(icon => icon.category === selectedCategory);

  const addIconToCanvas = (IconComponent: React.ComponentType<any>, iconName: string) => {
    if (!canvas) return;

    // Icon als SVG-String rendern
    const iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${iconSize}" height="${iconSize}">
        <path fill="${selectedColor}" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"/>
      </svg>
    `;

    // Erstelle ein Fabric-Objekt aus SVG
    // Alternativ: Text mit Icon-Font oder Path-Objekt
    const group = new fabric.Group([
      new fabric.Circle({
        radius: iconSize / 2,
        fill: selectedColor,
        originX: 'center',
        originY: 'center',
      })
    ], {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      originX: 'center',
      originY: 'center',
    });

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg" style={{ color: COLORS.text }}>
        Icons hinzufügen
      </h3>

      {/* Farbe auswählen */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: COLORS.text }}>
          Icon-Farbe
        </label>
        <div className="flex gap-2 mb-2">
          {ICON_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className="w-8 h-8 rounded border-2 transition-all"
              style={{
                backgroundColor: color,
                borderColor: selectedColor === color ? COLORS.primary : '#e0e0e0',
                transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)',
              }}
              title={color}
            />
          ))}
        </div>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="w-full h-8 rounded border"
          style={{ borderColor: '#e0e0e0' }}
        />
      </div>

      {/* Größe */}
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: COLORS.text }}>
          Icon-Größe: {iconSize}px
        </label>
        <input
          type="range"
          min="24"
          max="128"
          value={iconSize}
          onChange={(e) => setIconSize(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex gap-2 mt-1">
          {[32, 48, 64, 96].map((size) => (
            <button
              key={size}
              onClick={() => setIconSize(size)}
              className="px-2 py-1 text-xs rounded border"
              style={{
                borderColor: iconSize === size ? COLORS.primary : '#e0e0e0',
                backgroundColor: iconSize === size ? COLORS.primary : 'transparent',
                color: iconSize === size ? COLORS.white : COLORS.text,
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Kategorien */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: COLORS.text }}>
          Kategorie
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="px-2 py-1 text-xs rounded border transition-colors"
              style={{
                borderColor: selectedCategory === category.id ? COLORS.primary : '#e0e0e0',
                backgroundColor: selectedCategory === category.id ? COLORS.primary : 'transparent',
                color: selectedCategory === category.id ? COLORS.white : COLORS.text,
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Icon Grid */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: COLORS.text }}>
          Icon auswählen ({filteredIcons.length})
        </label>
        <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto p-1">
          {filteredIcons.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => addIconToCanvas(Icon, item.name)}
                className="flex items-center justify-center p-3 rounded-lg border-2 transition-all hover:shadow-md"
                style={{ 
                  borderColor: '#e0e0e0',
                  color: selectedColor,
                }}
                title={item.name}
              >
                <Icon size={32} />
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Klicke auf ein Icon, um es zum Canvas hinzuzufügen. Du kannst es dann verschieben, skalieren und drehen.
      </p>
    </div>
  );
};

export default IconPicker;

