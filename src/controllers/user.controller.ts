import { getUsers, getUser as getUserById, createUser as create, IUserPayload } from '../models/user.model'
import { User } from '../entity'

export const getAll = async (): Promise<User[]> => {
  const users = await getUsers()
  return users
}

export const getUser = async (id: string): Promise<User | null> => {
  // validate input

  // finish validation
  const user = await getUserById(Number(id))
  return user
}

export const createUser = async (body: IUserPayload): Promise<User> => {
  // validate input

  // finish validation
  return await create(body)
}
