// src/lib/use-get-user-role.ts
'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useGetUserRole(userRole: Roles) {
    const { data: session, status } = useSession(); 
    
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login');
        }
    }, [status, router]);

    if (status === "loading" || !session) {
        return false;
    }

    const userRoleFromSession = session?.user?.role;
    return userRoleFromSession === userRole;
}