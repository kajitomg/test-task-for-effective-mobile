class ApiError extends Error {
  public status: number
  public errors: string[]
  
  constructor(status: number, message: string, errors: string[] = []) {
    super(message);
    this.status = status
    this.errors = errors
  }
  
  static BadRequest(message: string, errors: string[] = []) {
    return new ApiError(400, message, errors)
  }
  static UnauthorizedError(message?: string = 'Не авторизован', errors: string[] = []) {
    return new ApiError(403, message, errors)
  }
  static ForbiddenError(message?: string = 'Доступ запрещен', errors: string[] = []) {
    return new ApiError(403, message, errors)
  }
  static NotFoundError(message: string = 'Ресурс не найден', errors: string[] = []) {
    return new ApiError(404, message, errors)
  }
  static ConflictError(message: string = 'Конфликт данных', errors: string[] = []) {
    return new ApiError(409, message, errors)
  }
}

export {ApiError}