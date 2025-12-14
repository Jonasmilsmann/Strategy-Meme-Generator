import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaTicketAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/instantdb';
import { COLORS } from '../../constants/branding';
import LoadingSpinner from '../Common/LoadingSpinner';

const LoginPage: React.FC = () => {
  const { signIn, signUp, isConfigured } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isConfigured) {
        throw new Error('InstantDB ist nicht konfiguriert. Bitte füge deine App ID in der .env Datei hinzu.');
      }

      if (isLogin) {
        // If password/code provided, try to sign in with it
        if (password && password.length > 0) {
          try {
            await db.auth.signInWithMagicCode({ email, code: password });
          } catch (err: any) {
            // If code is wrong, send new code
            await signIn(email, password);
            throw new Error('Ungültiger Code. Ein neuer Login-Code wurde an deine Email gesendet.');
          }
        } else {
          // Otherwise just send magic code
          await signIn(email, password);
        }
      } else {
        if (!inviteCode.trim()) {
          throw new Error('Bitte gib einen Invite-Code ein');
        }
        await signUp(email, password, inviteCode);
      }
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#f5f5f5' }}
    >
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ color: COLORS.primary }}
          >
            Strategy Meme Generator
          </h1>
          <p className="text-gray-600">
            Erstelle und teile lustige Memes
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <h2 
              className="text-2xl font-semibold text-center"
              style={{ color: COLORS.text }}
            >
              {isLogin ? 'Anmelden' : 'Registrieren'}
            </h2>
          </div>

          {!isConfigured && (
            <div 
              className="mb-4 p-3 rounded-md text-sm"
              style={{ backgroundColor: '#fff3cd', color: '#856404' }}
            >
              ⚠️ InstantDB ist nicht konfiguriert. Bitte füge deine App ID in der <code>.env</code> Datei hinzu.
            </div>
          )}

          {error && (
            <div 
              className="mb-4 p-3 rounded-md text-sm"
              style={{ backgroundColor: '#f8d7da', color: '#721c24' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: COLORS.text }}
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ 
                    borderColor: '#e0e0e0',
                  }}
                  placeholder="deine@email.com"
                  required
                  disabled={loading || !isConfigured}
                />
              </div>
            </div>

            {/* Password / Magic Code - Only show for login when user has code */}
            {isLogin && (
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.text }}
                >
                  Login-Code (aus Email)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#e0e0e0' }}
                    placeholder="Code aus Email eingeben"
                    disabled={loading || !isConfigured}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Klicke auf "Anmelden" um einen Login-Code an deine Email zu erhalten.
                </p>
              </div>
            )}

            {/* Invite Code (only for signup) */}
            {!isLogin && (
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.text }}
                >
                  Invite-Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTicketAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 uppercase"
                    style={{ borderColor: '#e0e0e0' }}
                    placeholder="ABCD1234"
                    required
                    disabled={loading || !isConfigured}
                    maxLength={8}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Du benötigst einen Invite-Code um dich zu registrieren
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isConfigured}
              className="w-full py-3 rounded-md font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: COLORS.primary, 
                color: COLORS.white 
              }}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  <span>{isLogin ? 'Anmelden...' : 'Registrieren...'}</span>
                </>
              ) : (
                <span>{isLogin ? 'Anmelden' : 'Registrieren'}</span>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm hover:underline"
              style={{ color: COLORS.primary }}
              disabled={loading}
            >
              {isLogin 
                ? 'Noch kein Account? Jetzt registrieren' 
                : 'Bereits registriert? Jetzt anmelden'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            🔒 Nur zugelassene Nutzer mit gültigem Invite-Code können sich registrieren
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

