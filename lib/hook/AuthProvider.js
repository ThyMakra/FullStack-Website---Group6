import { createContext, useContext, useState } from "react";

import { AuthService } from "../service/AuthService";


const authContext = createContext();

export const AuthProvider = (props) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState();

    const loginWithGoogle = async () => {
        const { user, error } = await AuthService.loginWithGoogle()

        setUser(user ?? null);
        setError(error ?? "");
    }

    const registerWithEmailPassword = async (email, password) => {
        const {user, error} = await AuthService.registerWithEmailPassword(email, password)
        
        setUser(user ?? null)
        setError(error ?? "")

        return {user, error}
    }

    const loginWithEmailPassword = async (email, password) => {
        const {user, error} = await AuthService.loginWithEmailPassword(email, password)

        setUser(user ?? null)
        setError(error ?? "")

        return {user, error}
    }
    

    const logout = async () => {
        await AuthService.logout();
        setUser(null);
    }

    const getDocument = async () => {
        if (!user) return false;
        const doc = await AuthService.getDocument(user);
        return doc;
    }

    const mergeDocument = async (document) => {
        if (!user) return false;
        await AuthService.mergeDocument(user, document);
        return true;
    }

    const value = { user, setUser, error, setError, loginWithGoogle, logout, getDocument, mergeDocument, registerWithEmailPassword,loginWithEmailPassword };

    return <authContext.Provider value={value} {...props} />
}

export default function useAuth() {
    return useContext(authContext);
}
