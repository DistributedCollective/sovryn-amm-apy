import express, { NextFunction, Request, Response } from 'express'
// import { buildCheckFunction, validationResult } from 'express-validator'
import { getAmmApyAll } from '../controllers/apy.controller'
import asyncMiddleware from '../utils/asyncMiddleware'
// import { InputValidateError } from '../errorHandlers/baseError'

export const router = express.Router()

// const checkBodyAndParams = buildCheckFunction(['body', 'params'])

router.get(
  '/',
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info('handling amm apy all request')
      const response = await getAmmApyAll()
      res.send(response)
    } catch (error) {
      next(error)
    }
  })
)
