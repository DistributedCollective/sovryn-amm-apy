import { logger } from '../logger'
import getTimestamp from '../utils/getTimeStamp'

export const helloSovrynHandler = async (req: object): Promise<object> => {
  logger.info(req, 'helloSovrynHandler')
  const response = {
    reqStatus: 'SUCCESS',
    data: {
      message: 'Hello Sovryn!',
      timestamp: getTimestamp(),
      req
    }
  }
  return response
}
