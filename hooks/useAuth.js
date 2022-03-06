import { StyleSheet, Text, View } from "react-native";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import * as Google from "expo-google-app-auth";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "@firebase/auth";
import { auth } from "../firebase";
import {db} from "../firebase"
import {
  setDoc,
  doc,
} from 'firebase/firestore'
// auth provider will wrap the entire app
// higher order component. I.e., wrapping the lower level children. In this case, itpasses all the auth stuff to the children

const AuthContext = createContext({});

const config = {
  iosClientId:
    "186012380414-40eslojoch5eu8tr1v0jlqp8b578ikf6.apps.googleusercontent.com",
  androidClientId:
    "186012380414-0l49acbr8tn229uificld72jrci28mv0.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          //logged initializeApp
          setUser(user);
        } else {
          setUser(null);
        }

        setLoadingInitial(false);
      }),
    []
  );

  const logout = () => {
    setLoading(true);
    signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };
  const signInWithGoogle = async () => {
    setLoading(true);
    await Google.logInAsync(config)
      .then(async (logInResult) => {
        if (logInResult.type == "success") {
          const { idToken, accessToken, user } = logInResult;
          const credential = GoogleAuthProvider.credential(
            idToken,
            accessToken
          );
          
          await signInWithCredential(auth, credential);
          await setDoc(doc(db,'users',user.id),{
            name: user.name,
            id: user.id
          })
        }
        return Promise.reject();
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  const memoedValue = useMemo(
    () => ({
      user: user,
      loading,
      error,
      signInWithGoogle,
      logout,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext); //uses the context on whether or not the user is signed in
}