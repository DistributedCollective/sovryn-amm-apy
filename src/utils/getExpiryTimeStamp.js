const moment = require('moment')

const getExpiryTimePriceData = () => {
  const currentTime = moment()
  const expiry = moment().add(15, 'minutes').toISOString()
  console.log('OTP Expiry: currentTime', currentTime, 'expiryTime', expiry)
  return expiry
}

module.exports = { getExpiryTimePriceData }
