import { ValidationError } from 'class-validator'
import { ValidationError as InputValidationError } from 'express-validator'

export class BaseError extends Error {
  public readonly name: string
  public readonly statusCode: HttpStatusCode
  public readonly isOperational: boolean

  constructor (name: string, statusCode: HttpStatusCode, description: string, isOperational: boolean) {
    super(description)

    this.name = name
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this)
  }
}

export class APIError extends BaseError {
  constructor (name: string, statusCode = HttpStatusCode.INTERNAL_SERVER, description = 'internal server error', isOperational = true) {
    super(name, statusCode, description, isOperational)
  }
}

export class HTTP400Error extends BaseError {
  constructor (description = 'bad request') {
    super('BAD REQUEST', HttpStatusCode.BAD_REQUEST, description, true)
  }
}

export class HTTP404Error extends BaseError {
  constructor (description = 'not found') {
    super('NOT FOUND', HttpStatusCode.NOT_FOUND, description, true)
  }
}

export class ValidateError extends BaseError {
  public readonly errors: ValidationError[]
  constructor (errors: ValidationError[], description = 'Validation Error') {
    super('UNPROCESSABLE ENTITY', HttpStatusCode.UNPROCESSABLE_ENTITY, description, true)
    this.errors = errors
  }
}

export class InputValidateError extends BaseError {
  public readonly errors: InputValidationError[]
  constructor (
    errors: InputValidationError[],
    description = 'Input validation Error'
  ) {
    super(
      'UNPROCESSABLE ENTITY',
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      description,
      true
    )
    this.errors = errors
  }
}

export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNPROCESSABLE_ENTITY = 422,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}
