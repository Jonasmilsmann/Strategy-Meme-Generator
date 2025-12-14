import React, { useState, useMemo } from 'react';
import { fabric } from 'fabric';
import { FaSearch } from 'react-icons/fa';
import { MEME_TEMPLATES, TEMPLATE_CATEGORIES } from '../../constants/templates';
import { useMeme } from '../../contexts/MemeContext';
import { COLORS } from '../../constants/branding';

const TemplateLibrary: React.FC = () => {
  const { canvas } = useMeme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter nach Kategorie und Suchbegriff
  const filteredTemplates = useMemo(() => {
    let templates = MEME_TEMPLATES;
    
    // Filter nach Kategorie
    if (selectedCategory !== 'all') {
      templates = templates.filter(t => t.category === selectedCategory);
    }
    
    // Filter nach Suchbegriff
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      templates = templates.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }
    
    return templates;
  }, [selectedCategory, searchQuery]);

  const loadTemplate = (imageUrl: string, templateId: string) => {
    if (!canvas) return;

    setLoading(templateId);

    fabric.Image.fromURL(imageUrl, (img) => {
      // Canvas-Größe an Bild anpassen
      const maxWidth = 800;
      const maxHeight = 600;
      
      const scale = Math.min(
        maxWidth / (img.width || 1),
        maxHeight / (img.height || 1)
      );

      canvas.setWidth((img.width || maxWidth) * scale);
      canvas.setHeight((img.height || maxHeight) * scale);

      // Bild als Hintergrund setzen
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: scale,
        scaleY: scale,
      });

      setLoading(null);
    }, { crossOrigin: 'anonymous' });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg" style={{ color: COLORS.text }}>
        Meme-Vorlagen ({MEME_TEMPLATES.length})
      </h3>

      {/* Suchfeld */}
      <div className="relative">
        <input
          type="text"
          placeholder="Meme suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border text-sm"
          style={{ 
            borderColor: COLORS.gray,
            color: COLORS.text,
          }}
        />
        <FaSearch 
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
          style={{ color: COLORS.gray }}
        />
      </div>

      {/* Kategorie Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className="px-3 py-1 text-xs border transition-colors font-normal"
          style={{
            borderColor: COLORS.gray,
            backgroundColor: selectedCategory === 'all' ? COLORS.primary : COLORS.white,
            color: selectedCategory === 'all' ? COLORS.white : COLORS.gray,
          }}
        >
          Alle
        </button>
        {TEMPLATE_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className="px-3 py-1 text-xs border transition-colors capitalize font-normal"
            style={{
              borderColor: COLORS.gray,
              backgroundColor: selectedCategory === category ? COLORS.primary : COLORS.white,
              color: selectedCategory === category ? COLORS.white : COLORS.gray,
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Ergebnisse */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: COLORS.gray }}>
            Keine Memes gefunden für "{searchQuery}"
          </p>
        </div>
      )}

      {/* Template Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="relative group cursor-pointer overflow-hidden border-2 transition-all hover:shadow-lg"
            style={{ borderColor: loading === template.id ? COLORS.primary : COLORS.gray }}
            onClick={() => loadTemplate(template.imageUrl, template.id)}
          >
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-32 object-cover"
            />
            <div 
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center"
            >
              <span className="text-white font-medium text-sm opacity-0 group-hover:opacity-100">
                {loading === template.id ? 'Lädt...' : 'Auswählen'}
              </span>
            </div>
            <div className="p-2 bg-white">
              <p className="text-xs font-medium truncate" style={{ color: COLORS.text }}>
                {template.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateLibrary;

