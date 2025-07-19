import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Adjust path as necessary

// Create the context
const AuthContext = createContext();

// Create a provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user (null if logged out)
      setLoading(false);    // Set loading to false after first check
      console.log("Auth state checked in context:", currentUser ? currentUser.uid : 'No user');
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Value provided to consuming components
  const value = {
    user,
    loading,
    // You could add login/logout functions here later if needed
  };

  // Render children only after initial loading is complete?
  // Or provide loading state for children to handle?
  // Providing loading state is usually more flexible.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuthStatus() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthStatus must be used within an AuthProvider');
  }
  return context;
} 