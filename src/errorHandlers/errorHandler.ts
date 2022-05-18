import { NextFunction, Request, Response } from 'express'
import { BaseError } from './baseError'
import config, { Environment } from '../config/config'
import { isNil } from 'lodash'

const { env } = config

class ErrorHandler {
  public async handleError (err: BaseError, req: Request, res: Response, _next: NextFunction): Promise<void> {
    const statusCode = !isNil(err.statusCode) ? err.statusCode : 500
    res.status(statusCode).json({
      message: err.message,
      error: err,
      stack: env !== Environment.Production ? err.stack : null
    })

    !isNil(req.log) ? req.log.error(
      { err },
      err.message
    ) : console.error(err, err.message)

    // await sendMailToAdminIfCritical();
    // await sendEventsToSentry();
  }

  public isTrustedError (error: Error): boolean {
    if (error instanceof BaseError) {
      return error.isOperational
    }
    return false
  }
}
export default new ErrorHandler()
