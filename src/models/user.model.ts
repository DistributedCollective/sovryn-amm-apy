import { getRepository } from 'typeorm'
import { validate } from 'class-validator'
import { User } from '../entity'
import { ValidateError } from '../errorHandlers/baseError'

export interface IUserPayload {
  firstName: string
  lastName: string
  email: string
}

export const getUsers = async (): Promise<User[]> => {
  const userRepository = getRepository(User)
  return await userRepository.find()
}

export const getUser = async (id: number): Promise<User | null> => {
  const userRepository = getRepository(User)
  const user = await userRepository.findOne({ id: id })
  if (user == null) return null
  return user
}

export const createUser = async (payload: IUserPayload): Promise<User> => {
  const userRepository = getRepository(User)
  const user = new User()
  user.firstName = payload.firstName
  user.lastName = payload.lastName
  user.email = payload.email

  const errors = await validate(user)
  if (errors.length > 0) {
    throw new ValidateError(errors)
  } else {
    return await userRepository.save({
      ...user,
      ...payload
    })
  }
}
