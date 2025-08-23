"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc 
} from "firebase/firestore";
import app from "@/lib/firebase";

interface AdminUser {
  uid: string;
  email: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Check if user is admin
        try {
          const adminDoc = await getDoc(doc(db, "adminUsers", user.uid));
          if (adminDoc.exists() && adminDoc.data().isAdmin === true) {
            setAdminUser({
              uid: user.uid,
              email: user.email || "",
              role: "admin",
              name: adminDoc.data().name || user.email || ""
            });
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      } else {
        setAdminUser(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, [auth, db]);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is admin
      const adminDoc = await getDoc(doc(db, "adminUsers", result.user.uid));
      if (adminDoc.exists() && adminDoc.data().isAdmin === true) {
        setAdminUser({
          uid: result.user.uid,
          email: result.user.email || "",
          role: "admin",
          name: adminDoc.data().name || result.user.email || ""
        });
      } else {
        throw new Error("Access denied. Admin privileges required.");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAdminUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    user,
    adminUser,
    isAdmin: !!adminUser,
    isLoading,
    signIn,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
