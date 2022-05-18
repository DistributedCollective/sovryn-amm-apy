import {
  Entity,
  Column
} from 'typeorm'

import { Length, IsEmail } from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
export class User extends AbstractBaseEntity {
  @Column()
  @Length(2, 10)
  firstName!: string

  @Column()
  @Length(2, 10)
  lastName!: string

  @Column()
  @IsEmail()
  email!: string
}
