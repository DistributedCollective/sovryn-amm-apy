import moment from 'moment'

const getTimestamp = (): string => {
  const currentTime = moment().toISOString()
  return currentTime
}

export default getTimestamp
