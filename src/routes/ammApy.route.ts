import express, { NextFunction, Request, Response } from 'express'
import {
  getAmmApyAll,
  getPoolApyToday,
  getPoolData
} from '../controllers/apy.controller'
import asyncMiddleware from '../utils/asyncMiddleware'
import { buildCheckFunction, validationResult } from 'express-validator'
import { InputValidateError } from '../errorHandlers/baseError'

const checkBodyAndParams = buildCheckFunction(['body', 'params'])

export const router = express.Router()

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

router.get(
  '/pool/:pool',
  checkBodyAndParams('pool').exists().isEthereumAddress(),
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info('handling amm apy all request')
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        req.log.debug(errors.array(), 'handling message errors')
        throw new InputValidateError(errors.array())
      }
      const response = await getPoolData(req.params.pool)
      res.send(response)
    } catch (error) {
      next(error)
    }
  })
)

router.get(
  '/today/:pool',
  checkBodyAndParams('pool').exists().isEthereumAddress(),
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info('handling amm apy all request')
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        req.log.debug(errors.array(), 'handling message errors')
        throw new InputValidateError(errors.array())
      }
      const response = await getPoolApyToday(req.params.pool)
      res.send(response)
    } catch (error) {
      next(error)
    }
  })
)

router.get(
  '/pool-balance/:poolSymbol',
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info('handling pool balance request')
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        req.log.debug(errors.array(), 'handling message errors')
        throw new InputValidateError(errors.array())
      }
      // const response = await getPoolApyToday(req.params.pool);
      // res.send(response);
      res.status(200).send('Placeholder')
    } catch (error) {
      next(error)
    }
  })
)
