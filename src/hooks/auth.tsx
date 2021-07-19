import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { CLIENT_ID } = process.env
const { REDIRECT_URI } = process.env
const { RESPONSE_TYPE } = process.env
const { SCOPE } = process.env

interface AuthProviderProps {
  children: ReactNode
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  userStorageLoading: boolean;
  siginWithGoogle(): Promise<void>;
  siginWithApple(): Promise<void>;
  signOut(): void;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  },
  type: string
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {

  const [userStorageLoading, setUserStorageLoading] = useState(true);
  const [user, setUser] = useState({} as User)

  async function getUserLogged() {
    const userLogged = await AsyncStorage.getItem('@gofinances:user')

    if (userLogged) {
      const user: User = JSON.parse(userLogged)
      setUser(user)
    }

    setUserStorageLoading(false)
  }

  useEffect(() => {
    getUserLogged()
  }, [])

  async function siginWithGoogle() {
    try {
      const ScopeEncoded = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${ScopeEncoded}`;

      const { params, type } = await AuthSession.startAsync({ authUrl: authUrl }) as AuthorizationResponse

      if (type === 'success') {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
        const userInfo = await response.json()

        const userLogged = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture
        }

        setUser(userLogged)
        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged))
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async function siginWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      })

      if (credential) {
        const name = credential.fullName!.givenName!
        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name,
          photo: `https://ui-avatars.com/api?name=${name}&length=1`

        }
        setUser(userLogged)
        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged))
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem('@gofinances:user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      siginWithGoogle,
      siginWithApple,
      signOut,
      userStorageLoading
    }}>
      {children}
    </AuthContext.Provider>

  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth }