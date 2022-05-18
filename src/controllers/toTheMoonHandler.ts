import getTimestamp from '../utils/getTimeStamp'

export const toTheMoonHandler = async (req: object): Promise<object> => {
  const response = {
    reqStatus: 'SUCCESS',
    data: {
      message: 'To The Moon!',
      timestamp: getTimestamp(),
      req
    }
  }
  return response
}
