import express, { NextFunction, Request, Response } from 'express'
import { getAmmApyAll } from '../controllers/apy.controller'
import asyncMiddleware from '../utils/asyncMiddleware'

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