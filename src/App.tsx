import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { MemeProvider, useMeme } from './contexts/MemeContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AppHeader from './components/Header/AppHeader';
import Sidebar from './components/Sidebar/Sidebar';
import CanvasToolbar from './components/Canvas/CanvasToolbar';
import MemeCanvas from './components/Canvas/MemeCanvas';
import CanvasDropZone from './components/Canvas/CanvasDropZone';
import DownloadModal from './components/Modals/DownloadModal';
import SaveModal from './components/Modals/SaveModal';
import MemeFeed from './components/Feed/MemeFeed';
import InviteManager from './components/Admin/InviteManager';
import Toast from './components/Common/Toast';
import { useToast } from './hooks/useToast';
import { COLORS } from './constants/branding';

type Page = 'generator' | 'feed' | 'invites';

function AppContent() {
  const { canvas } = useMeme();
  const [currentPage, setCurrentPage] = useState<Page>('generator');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { toasts, hideToast, success, error } = useToast();

  const canSave = canvas !== null;

  const handleSave = () => {
    if (!canvas) {
      error('Kein Canvas vorhanden');
      return;
    }
    setShowSaveModal(true);
  };

  const handleDownload = () => {
    if (!canvas) {
      error('Kein Canvas vorhanden');
      return;
    }
    setShowDownloadModal(true);
  };

  const handleSaveSuccess = () => {
    success('Meme erfolgreich gespeichert und im Feed veröffentlicht!');
    setCurrentPage('feed'); // Navigate to feed after saving
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: COLORS.white }}>
      {/* Header */}
      <AppHeader 
        onSave={handleSave} 
        onDownload={handleDownload} 
        canSave={canSave}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      {/* Main Content */}
      {currentPage === 'generator' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Canvas Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <CanvasToolbar />
            
            {/* Canvas Container with Drag & Drop */}
            <CanvasDropZone>
              <div 
                className="flex-1 flex items-center justify-center p-8 overflow-auto h-full"
                style={{ backgroundColor: '#F5F5F5' }}
              >
                <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
                  <MemeCanvas />
                </div>
              </div>
            </CanvasDropZone>
          </div>
        </div>
      )}

      {currentPage === 'feed' && <MemeFeed />}
      
      {currentPage === 'invites' && <InviteManager />}

      {/* Modals */}
      <DownloadModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} />
      <SaveModal 
        isOpen={showSaveModal} 
        onClose={() => setShowSaveModal(false)}
        onSaved={handleSaveSuccess}
      />

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <MemeProvider>
          <AppContent />
        </MemeProvider>
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
