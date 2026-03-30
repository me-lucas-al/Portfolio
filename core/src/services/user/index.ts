import { CreateUserType, DeleteUserType, UpdateUserType } from "@portfolio/packages/schemas/user/index";
import { IUserRepository } from "../../repositories/user-repository.interface";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async createUser(data: CreateUserType) {
    return this.userRepository.create(data);
  }

  async getAllUsers(id?: number) {
    if (id !== undefined) {
      const user = await this.userRepository.findById(id);
      return user ? [user] : [];
    }
    return this.userRepository.findAll();
  }

  async deleteUser(data: DeleteUserType) {
    return this.userRepository.delete(data.id);
  }

  async updateUser(data: UpdateUserType) {
    return this.userRepository.update(data);
  }
}
