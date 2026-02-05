import { AppError } from "./base";

export class BadRequestError extends AppError {
  constructor(message: string = "Dados inválidos.") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Token inválido ou acesso não autorizado.") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Você não tem permissão para acessar este recurso.") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso não encontrado.") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Dados conflitantes.") {
    super(message, 409);
  }
}