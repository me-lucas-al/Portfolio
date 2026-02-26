// src/lib/use-get-user-role.ts
'use client';
import { useSession } from "next-auth/react";

export function useGetUserRole(userRole: Roles) {
    const { data: session, status } = useSession(); 

    if (status === "loading" || !session) {
        return false;
    }

    const userRoleFromSession = session?.user?.role;
    return userRoleFromSession === userRole;
}