import express, { NextFunction, Request, Response } from 'express'
import { buildCheckFunction, validationResult } from 'express-validator'
import { createUser, getAll, getUser } from '../controllers/user.controller'
import asyncMiddleware from '../utils/asyncMiddleware'
import { InputValidateError } from '../errorHandlers/baseError'

export const router = express.Router()

const checkBodyAndParams = buildCheckFunction(['body', 'params'])

router.post(
  '/',
  checkBodyAndParams('firstName').trim().isAscii(),
  checkBodyAndParams('lastName').trim().isAscii(),
  checkBodyAndParams('email').trim().isEmail().optional(),
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new InputValidateError(errors.array())
      }
      req.log.info(req.body, 'handling create user request')
      const user = await createUser(req.body)
      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  })
)

router.get(
  '/',
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info('handling user request')
      const response = await getAll()
      res.send(response)
    } catch (error) {
      next(error)
    }
  })
)

router.get(
  '/:id',
  checkBodyAndParams('id').trim().isUUID().exists(),
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new InputValidateError(errors.array())
      }
      req.log.info(req.body, 'handling user request')
      const response = await getUser(req.params.id)
      res.send(response)
    } catch (error) {
      next(error)
    }
  })
)
