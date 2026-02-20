import { CreateUserType, DeleteUserType, UpdateUserType } from "@portfolio/packages/schemas/user/index";
import prisma from "@portfolio/database/prisma";

export class UserService {
    static async createUser(data: CreateUserType){
        const newUser = await prisma.user.create({
            data: data,
        });
        return newUser;
    }

    static async getAllUsers(id?:number){
        const users = await prisma.user.findMany({
            where: id !== undefined ? { id } : {}
        });
        return users;
    }

    static async deleteUser(data: DeleteUserType){
        const deletedUser = await prisma.user.delete({
            where: { id: data.id }
        })
        return deletedUser;
    }

    static async updateUser(data: UpdateUserType){
        const { id, ...userData } = data
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { ...userData }
        })
        return updatedUser;
    }
}