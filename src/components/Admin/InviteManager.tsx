import React, { useState } from 'react';
import { FaPlus, FaCopy, FaCheck } from 'react-icons/fa';
import { db, generateInviteCode } from '../../services/instantdb';
import { id } from '@instantdb/react';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/branding';
import LoadingSpinner from '../Common/LoadingSpinner';

const InviteManager: React.FC = () => {
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Query all invite codes
  const { data, isLoading, error } = db.useQuery({
    inviteCodes: {
      $: {
        order: {
          serverCreatedAt: 'desc',
        },
      },
    },
  });

  const handleGenerateCode = async () => {
    if (!user) return;

    setGenerating(true);
    try {
      const newCode = generateInviteCode();
      
      await db.transact([
        db.tx.inviteCodes[id()].update({
          code: newCode,
          used: false,
          usedBy: null,
          createdBy: user.email || user.id,
          createdAt: Date.now(),
        }),
      ]);
    } catch (err) {
      console.error('Error generating invite code:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const inviteCodes = data?.inviteCodes || [];
  const unusedCodes = inviteCodes.filter((c: any) => !c.used);
  const usedCodes = inviteCodes.filter((c: any) => c.used);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="p-4 rounded-md m-4"
        style={{ backgroundColor: '#f8d7da', color: '#721c24' }}
      >
        Fehler beim Laden der Invite-Codes: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: COLORS.primary }}
        >
          Invite-Code Manager
        </h1>
        <p className="text-gray-600">
          Erstelle und verwalte Invite-Codes für neue Nutzer
        </p>
      </div>

      {/* Generate Button */}
      <div className="mb-8">
        <button
          onClick={handleGenerateCode}
          disabled={generating}
          className="flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all hover:opacity-90 disabled:opacity-50"
          style={{ 
            backgroundColor: COLORS.primary, 
            color: COLORS.white 
          }}
        >
          {generating ? (
            <>
              <LoadingSpinner />
              <span>Generiere Code...</span>
            </>
          ) : (
            <>
              <FaPlus />
              <span>Neuen Invite-Code generieren</span>
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold" style={{ color: COLORS.primary }}>
            {inviteCodes.length}
          </div>
          <div className="text-gray-600 mt-1">Gesamt</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-green-600">
            {unusedCodes.length}
          </div>
          <div className="text-gray-600 mt-1">Verfügbar</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-gray-400">
            {usedCodes.length}
          </div>
          <div className="text-gray-600 mt-1">Verwendet</div>
        </div>
      </div>

      {/* Unused Codes */}
      <div className="mb-8">
        <h2 
          className="text-xl font-semibold mb-4"
          style={{ color: COLORS.text }}
        >
          Verfügbare Codes ({unusedCodes.length})
        </h2>
        {unusedCodes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            Keine verfügbaren Codes. Generiere einen neuen Code.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead style={{ backgroundColor: COLORS.accent }}>
                <tr>
                  <th className="text-left p-4 font-semibold" style={{ color: COLORS.text }}>
                    Code
                  </th>
                  <th className="text-left p-4 font-semibold" style={{ color: COLORS.text }}>
                    Erstellt von
                  </th>
                  <th className="text-left p-4 font-semibold" style={{ color: COLORS.text }}>
                    Erstellt am
                  </th>
                  <th className="text-right p-4 font-semibold" style={{ color: COLORS.text }}>
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody>
                {unusedCodes.map((code: any) => (
                  <tr 
                    key={code.id}
                    className="border-t"
                    style={{ borderColor: '#e0e0e0' }}
                  >
                    <td className="p-4">
                      <span 
                        className="font-mono font-bold text-lg"
                        style={{ color: COLORS.primary }}
                      >
                        {code.code}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {code.createdBy}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(code.createdAt).toLocaleDateString('de-DE')}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleCopyCode(code.code)}
                        className="px-4 py-2 rounded-md transition-all hover:opacity-80"
                        style={{ 
                          backgroundColor: copiedCode === code.code ? '#28a745' : COLORS.primary,
                          color: COLORS.white 
                        }}
                      >
                        {copiedCode === code.code ? (
                          <span className="flex items-center gap-2">
                            <FaCheck /> Kopiert
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <FaCopy /> Kopieren
                          </span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Used Codes */}
      {usedCodes.length > 0 && (
        <div>
          <h2 
            className="text-xl font-semibold mb-4"
            style={{ color: COLORS.text }}
          >
            Verwendete Codes ({usedCodes.length})
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead style={{ backgroundColor: COLORS.accent }}>
                <tr>
                  <th className="text-left p-4 font-semibold" style={{ color: COLORS.text }}>
                    Code
                  </th>
                  <th className="text-left p-4 font-semibold" style={{ color: COLORS.text }}>
                    Verwendet von
                  </th>
                  <th className="text-left p-4 font-semibold" style={{ color: COLORS.text }}>
                    Erstellt von
                  </th>
                  <th className="text-left p-4 font-semibold" style={{ color: COLORS.text }}>
                    Erstellt am
                  </th>
                </tr>
              </thead>
              <tbody>
                {usedCodes.map((code: any) => (
                  <tr 
                    key={code.id}
                    className="border-t"
                    style={{ borderColor: '#e0e0e0' }}
                  >
                    <td className="p-4">
                      <span className="font-mono text-gray-400 line-through">
                        {code.code}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold" style={{ color: COLORS.text }}>
                        {code.usedBy}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {code.createdBy}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(code.createdAt).toLocaleDateString('de-DE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteManager;
