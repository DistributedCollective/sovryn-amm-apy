import { createConnection } from 'typeorm'
import config from './config/config'
import dbConfig from './config/database'
import app from './app'
import { jobList } from './services/cronJobs'
import balanceCache from './services/balanceCache'

const { appName, port } = config
createConnection(dbConfig)
  .then(() => {
    app.listen(port, () =>
      console.log(`${appName} Server Now Listening on ${port}. Stay Sovryn.`)
    )
  })
  .then(() =>
    /** Start cron jobs */
    jobList.forEach((job) => job.cronJob.start())
  )
  .then(() => {
    balanceCache.initialize().catch((e) => {
      console.error(e)
      throw new Error('Unable to initialize balance cache')
    })
  })
  .catch((err) => {
    console.log('Unable to connect to db', err)
    process.exit(1)
  })
