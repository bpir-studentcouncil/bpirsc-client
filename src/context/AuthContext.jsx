import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase.js';

const AuthContext = createContext();

const getFallbackUrl = () => {
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000';
  }
  return 'https://bpirsc-server.vercel.app';
};

const baseBackendUrl = import.meta.env.VITE_BACKEND_URL || getFallbackUrl();
const BACKEND_URL = baseBackendUrl.endsWith('/api') ? baseBackendUrl : `${baseBackendUrl}/api`;

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile with MongoDB backend
  const syncUserProfile = async (firebaseUser, customName = '', customRole = '') => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: customName || firebaseUser.displayName || firebaseUser.email.split('@')[0],
          role: customRole || 'student' // Default role
        }),
      });
      if (response.ok) {
        const dbUser = await response.json();
        return dbUser;
      }
      return null;
    } catch (error) {
      console.error('Error syncing user profile with backend:', error);
      return null;
    }
  };

  // Fetch role from backend db
  const fetchBackendProfile = async (uid) => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${uid}`
        }
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (err) {
      console.error('Failed to fetch backend profile:', err);
      return null;
    }
  };

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Get backend details (role) using user.uid directly
            let profile = await fetchBackendProfile(user.uid);
            if (!profile) {
              // If user exists in Firebase but not backend, sync them
              profile = await syncUserProfile(user);
            }
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              name: profile?.name || user.displayName || user.email.split('@')[0],
              role: profile?.role || 'student',
              profilePhoto: profile?.profilePhoto || user.photoURL || '',
              token: user.uid
            });
          } catch (err) {
            console.error('Error fetching/setting user on auth state change:', err);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Mock Authentication Mode
      const storedUser = localStorage.getItem('bpirsc_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // Fetch freshest role from mock backend if active
          fetchBackendProfile(parsed.uid).then(profile => {
            if (profile) {
              const updated = { ...parsed, role: profile.role, name: profile.name, profilePhoto: profile.profilePhoto || '' };
              setCurrentUser(updated);
              localStorage.setItem('bpirsc_user', JSON.stringify(updated));
            } else {
              setCurrentUser(parsed);
            }
            setLoading(false);
          }).catch(() => {
            setCurrentUser(parsed);
            setLoading(false);
          });
        } catch {
          setCurrentUser(null);
          setLoading(false);
        }
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    }
  }, []);

  // Login
  const login = async (email, password) => {
    setLoading(true);
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const profile = await fetchBackendProfile(user.uid);
        const loggedUser = {
          uid: user.uid,
          email: user.email,
          name: profile?.name || user.displayName || email.split('@')[0],
          role: profile?.role || 'student',
          profilePhoto: profile?.profilePhoto || user.photoURL || '',
          token: user.uid
        };
        setCurrentUser(loggedUser);
        setLoading(false);
        return loggedUser;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    } else {
      // Mock Login credentials check
      let mockProfile = null;
      if (email === 'admin@bpirsc.org') {
        mockProfile = { uid: 'mock-uid-admin', email, name: 'BPIRSC Executive Admin', role: 'admin', profilePhoto: '' };
      } else if (email === 'student@bpirsc.org') {
        mockProfile = { uid: 'mock-uid-student', email, name: 'Student', role: 'student', profilePhoto: '' };
      } else if (email === 'alumni@bpirsc.org') {
        mockProfile = { uid: 'mock-uid-alumni', email, name: 'Alumni', role: 'alumni', profilePhoto: '' };
      } else {
        // Fallback for new registration via login
        mockProfile = { uid: 'mock-uid-' + Date.now(), email, name: email.split('@')[0], role: 'student', profilePhoto: '' };
      }

      // Sync mock user to mock server file
      await syncUserProfile({ uid: mockProfile.uid, email: mockProfile.email, displayName: mockProfile.name }, mockProfile.name, mockProfile.role);
      
      const sessionUser = { ...mockProfile, token: mockProfile.uid };
      localStorage.setItem('bpirsc_user', JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);
      setLoading(false);
      return sessionUser;
    }
  };

  // Sign up
  const register = async (email, password, name, role = 'student') => {
    setLoading(true);
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Sync profile with role
        const dbUser = await syncUserProfile(user, name, role);
        const newUser = {
          uid: user.uid,
          email: user.email,
          name: name,
          role: dbUser?.role || role,
          profilePhoto: dbUser?.profilePhoto || user.photoURL || '',
          token: user.uid
        };
        setCurrentUser(newUser);
        setLoading(false);
        return newUser;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    } else {
      // Mock Registration
      const mockProfile = {
        uid: 'mock-uid-' + Date.now(),
        email,
        name,
        role: 'student', // Note: alumni registration request must be approved, starts as student
        profilePhoto: ''
      };
      
      await syncUserProfile({ uid: mockProfile.uid, email: mockProfile.email, displayName: name }, name, mockProfile.role);
      
      const sessionUser = { ...mockProfile, token: mockProfile.uid };
      localStorage.setItem('bpirsc_user', JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);
      setLoading(false);
      return sessionUser;
    }
  };

  // Login with Google (Optional)
  const loginWithGoogle = async () => {
    setLoading(true);
    if (isFirebaseConfigured && auth) {
      try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        let profile = await fetchBackendProfile(user.uid);
        if (!profile) {
          profile = await syncUserProfile(user);
        }
        const loggedUser = {
          uid: user.uid,
          email: user.email,
          name: profile?.name || user.displayName,
          role: profile?.role || 'student',
          profilePhoto: profile?.profilePhoto || user.photoURL || '',
          token: user.uid
        };
        setCurrentUser(loggedUser);
        setLoading(false);
        return loggedUser;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    } else {
      // Mock Google Login
      const mockProfile = {
        uid: 'mock-uid-google-' + Date.now(),
        email: 'googleuser@gmail.com',
        name: 'Google User',
        role: 'student'
      };
      await syncUserProfile({ uid: mockProfile.uid, email: mockProfile.email, displayName: mockProfile.name }, mockProfile.name, mockProfile.role);
      const sessionUser = { ...mockProfile, token: mockProfile.uid };
      localStorage.setItem('bpirsc_user', JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);
      setLoading(false);
      return sessionUser;
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
        setCurrentUser(null);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    } else {
      localStorage.removeItem('bpirsc_user');
      setCurrentUser(null);
      setLoading(false);
    }
  };

  const updateProfileDetails = async (newName, newPhotoUrl) => {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { 
          displayName: newName,
          photoURL: newPhotoUrl 
        });
      } catch (err) {
        console.warn('Firebase profile update warning:', err);
      }
    }

    const response = await fetch(`${BACKEND_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`
      },
      body: JSON.stringify({ name: newName, profilePhoto: newPhotoUrl })
    });

    if (!response.ok) {
      throw new Error('Failed to update profile on backend');
    }

    const dbUser = await response.json();
    const updatedUser = { 
      ...currentUser, 
      name: dbUser.name, 
      profilePhoto: dbUser.profilePhoto || '' 
    };
    setCurrentUser(updatedUser);

    if (!isFirebaseConfigured) {
      localStorage.setItem('bpirsc_user', JSON.stringify(updatedUser));
    }

    return updatedUser;
  };

  const switchUserRoleSelf = async (newRole) => {
    const response = await fetch(`${BACKEND_URL}/users/profile/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`
      },
      body: JSON.stringify({ role: newRole })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to switch role');
    }

    const dbUser = await response.json();
    const updatedUser = { 
      ...currentUser, 
      role: dbUser.role 
    };
    setCurrentUser(updatedUser);

    if (!isFirebaseConfigured) {
      localStorage.setItem('bpirsc_user', JSON.stringify(updatedUser));
    }

    return updatedUser;
  };

  // Forgot Password — sends Firebase reset email (not available in Demo mode)
  const forgotPassword = async (email) => {
    if (isFirebaseConfigured && auth) {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (error) {
        // Translate Firebase error codes to user-friendly messages
        if (error.code === 'auth/user-not-found') {
          throw new Error('No account found with this email address.');
        } else if (error.code === 'auth/invalid-email') {
          throw new Error('Please enter a valid email address.');
        } else if (error.code === 'auth/too-many-requests') {
          throw new Error('Too many requests. Please wait a moment and try again.');
        }
        throw error;
      }
    } else {
      throw new Error('DEMO_MODE');
    }
  };

  const value = {
    currentUser,
    login,
    register,
    loginWithGoogle,
    logout,
    forgotPassword,
    updateProfileDetails,
    switchUserRoleSelf,
    loading,
    isDemo: !isFirebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
