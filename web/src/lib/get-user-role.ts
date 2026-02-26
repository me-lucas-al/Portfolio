import { auth } from "@/auth";

export async function getUserRole(userRole: Roles) {
    const session = await auth(); 
    
    const userRoleFromSession = session?.user?.role;
    return userRoleFromSession === userRole;
}

