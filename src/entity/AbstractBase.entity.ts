import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  BeforeUpdate,
  BeforeInsert
} from 'typeorm'

import { validateOrReject, ValidationError } from 'class-validator'

import { ValidateError } from '../errorHandlers/baseError'

import log from '../logger'

const logger = log.logger.child({ module: 'AbstractBaseEntity' })

@Entity()
export class AbstractBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  // HOOKS
  @BeforeInsert()
  @BeforeUpdate()
  async validate (): Promise<void> {
    try {
      await validateOrReject(this, { skipMissingProperties: true })
    } catch (errors) {
      const errs = errors as ValidationError[]
      logger.warn(errs)
      throw new ValidateError(errs)
    }
  }

  async validateStrict (): Promise<void> {
    try {
      await validateOrReject(this, { skipMissingProperties: false })
    } catch (errors) {
      const errs = errors as ValidationError[]
      logger.warn(errs)
      throw new ValidateError(errs)
    }
  }
}
