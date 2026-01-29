import { CreateAdminType, DeleteAdminType, UpdateAdminType } from "@packages/schemas/admin";
import prisma from "../../../prisma";

export class AdminService {
    static async createAdmin(data: CreateAdminType){
        const newAdmin = await prisma.admin.create({
            data: data,
        });
        return newAdmin;
    }

    static async getAllAdmins(id?:number){
        const admins = await prisma.admin.findMany({
            where: id !== undefined ? { id } : {}
        });
        return admins;
    }

    static async deleteAdmin(data: DeleteAdminType){
        const deletedAdmin = await prisma.admin.delete({
            where: { id: data.id }
        })
    }

    static async updateAdmin(data: UpdateAdminType){
        const { id, ...adminData } = data
        const updatedAdmin = await prisma.admin.update({
            where: { id },
            data: { ...adminData }
        })
        return updatedAdmin;
    }
}