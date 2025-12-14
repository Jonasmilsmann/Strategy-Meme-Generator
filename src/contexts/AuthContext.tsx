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
      // @ts-ignore - InstantDB magic code auth only needs email initially
      await db.auth.signInWithMagicCode({ email });
      // Note: InstantDB uses magic codes by default
      // For production, you'd verify the code sent to email
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw new Error(error?.message || 'Login fehlgeschlagen');
    }
  };

  const signUp = async (email: string, _password: string, inviteCode: string) => {
    try {
      // First verify invite code by querying
      const result: any = await db.queryOnce({ 
        inviteCodes: {
          $: {
            where: {
              code: inviteCode,
              used: false,
            },
          },
        },
      });

      const inviteCodes = (result?.data?.inviteCodes || result?.inviteCodes || []) as any[];
      
      if (!inviteCodes || inviteCodes.length === 0) {
        throw new Error('Ungültiger oder bereits verwendeter Invite-Code');
      }

      const inviteCodeDoc = inviteCodes[0];

      // Sign in with email (InstantDB handles auth)
      // @ts-expect-error - InstantDB magic code auth only needs email initially
      await db.auth.signInWithMagicCode({ email });

      // Mark invite code as used and create user record
      await db.transact([
        db.tx.inviteCodes[inviteCodeDoc.id].update({
          used: true,
          usedBy: email,
        }),
        db.tx.users[id()].update({
          email,
          approved: true,
          inviteCode: inviteCode,
          createdAt: Date.now(),
        }),
      ]);
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw new Error(error?.message || 'Registrierung fehlgeschlagen');
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
