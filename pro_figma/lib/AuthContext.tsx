"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { User, onAuthStateChanged, signOut } from "firebase/auth";

interface AuthContextType {
    user: User | null;
    isGuest: boolean;
    isAdmin: boolean;
    loading: boolean;
    setGuest: (v: boolean) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null, isGuest: false, isAdmin: false, loading: true,
    setGuest: () => { }, logout: async () => { },
});

const ADMIN_EMAILS = ["admin@ayudaz.com"]; // cambia por tu email de admin

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isGuest, setGuest] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return unsub;
    }, []);

    const isAdmin = !!user && ADMIN_EMAILS.includes(user.email ?? "");

    const logout = async () => {
        await signOut(auth);
        setGuest(false);
    };

    return (
        <AuthContext.Provider value={{ user, isGuest, isAdmin, loading, setGuest, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);