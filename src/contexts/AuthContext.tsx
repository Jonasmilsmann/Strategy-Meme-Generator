import React, { createContext, useContext, ReactNode } from 'react';
import { db, isInstantDBConfigured } from '../services/instantdb';
import { id } from '@instantdb/react';

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, inviteCode: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isConfigured: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const isConfigured = isInstantDBConfigured();
  
  // Get auth state from InstantDB
  const { isLoading, user, error } = db.useAuth();

  const signIn = async (email: string, _password: string) => {
    try {
      // Simple auth: Just check if user exists and sign in with email
      // InstantDB will handle the auth automatically
      const result: any = await db.queryOnce({
        users: {
          $: {
            where: {
              email: email.trim().toLowerCase(),
            },
          },
        },
      });

      const users = (
        result?.data?.users || 
        result?.users || 
        (result?.data && Array.isArray(result.data) ? result.data : []) ||
        []
      ) as any[];

      if (!users || users.length === 0) {
        throw new Error('Kein Account mit dieser Email gefunden. Bitte registriere dich zuerst.');
      }

      // For InstantDB, we still need to use magic code auth, but we'll make it simpler
      // Send magic code and auto-sign in (user will need to check email once)
      await db.auth.sendMagicCode({ email });
      throw new Error('Ein Login-Code wurde an deine Email gesendet. Bitte prüfe deine Email und verwende den Code zum Login.');
    } catch (error: any) {
      console.error('Error signing in:', error);
      // Don't override custom error messages
      if (error.message && (error.message.includes('Email') || error.message.includes('Code'))) {
        throw error;
      }
      throw new Error(error?.message || 'Login fehlgeschlagen.');
    }
  };

  const signUp = async (email: string, _password: string, inviteCode: string) => {
    try {
      // Normalize inputs
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedCode = inviteCode.trim().toUpperCase();
      
      console.log('Checking invite code:', normalizedCode, 'for email:', normalizedEmail);
      
      // Check if user already exists
      const existingUserResult: any = await db.queryOnce({
        users: {
          $: {
            where: {
              email: normalizedEmail,
            },
          },
        },
      });

      const existingUsers = (
        existingUserResult?.data?.users || 
        existingUserResult?.users || 
        []
      ) as any[];

      if (existingUsers && existingUsers.length > 0) {
        throw new Error('Ein Account mit dieser Email existiert bereits. Bitte melde dich an.');
      }
      
      // Verify invite code
      const result: any = await db.queryOnce({ 
        inviteCodes: {
          $: {
            where: {
              code: normalizedCode,
              used: false,
            },
          },
        },
      });

      console.log('Query result:', result);
      
      const inviteCodes = (
        result?.data?.inviteCodes || 
        result?.inviteCodes || 
        (result?.data && Array.isArray(result.data) ? result.data : []) ||
        []
      ) as any[];
      
      console.log('Found invite codes:', inviteCodes);
      
      if (!inviteCodes || inviteCodes.length === 0) {
        console.error('No valid invite code found for:', normalizedCode);
        throw new Error('Ungültiger oder bereits verwendeter Invite-Code');
      }

      const inviteCodeDoc = inviteCodes[0];
      console.log('Using invite code:', inviteCodeDoc);

      // Create user record first (before auth)
      const userId = id();
      await db.transact([
        db.tx.inviteCodes[inviteCodeDoc.id].update({
          used: true,
          usedBy: normalizedEmail,
        }),
        db.tx.users[userId].update({
          email: normalizedEmail,
          approved: true,
          inviteCode: normalizedCode,
          createdAt: Date.now(),
        }),
      ]);

      // Now sign in with magic code (one-time setup)
      // User will receive code via email for initial login
      await db.auth.sendMagicCode({ email: normalizedEmail });
      
      // Note: User needs to check email for magic code to complete first login
      // After that, they can use regular login
      throw new Error('Registrierung erfolgreich! Ein Login-Code wurde an deine Email gesendet. Bitte prüfe deine Email und verwende den Code zum ersten Login.');
    } catch (error: any) {
      console.error('Error signing up:', error);
      // Don't override custom error messages
      if (error.message && (error.message.includes('Email') || error.message.includes('Code') || error.message.includes('erfolgreich'))) {
        throw error;
      }
      throw new Error(error?.message || 'Registrierung fehlgeschlagen.');
    }
  };

  const signOut = () => {
    try {
      db.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  if (error) {
    console.error('Auth error:', error);
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isConfigured,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
