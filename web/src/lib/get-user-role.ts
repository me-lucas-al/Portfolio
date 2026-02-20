import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getUserRole(userRole: Roles) {
    const session = await auth();
    if (!session) redirect('/login'); 
    
    const userRoleFromSession = session?.user?.role;
    return userRoleFromSession === userRole;
}

