import { CronJob } from 'cron'
import { main as mainBlockFunction } from './blockCronJob'
import log from '../logger'

const logger = log.logger.child({ module: 'Cron Jobs' })

class AbstractCronJob {
  cronFunction: () => Promise<void>
  cronJob: CronJob
  jobName: string
  runFunction: () => void

  constructor (
    cronFunction: () => Promise<void>,
    cronTime: string,
    jobName: string
  ) {
    this.cronFunction = cronFunction
    this.jobName = jobName
    this.runFunction = async () => {
      logger.info(`Starting cron job: ${jobName}`)
      this.cronFunction()
        .then(() => logger.info(`Cron job completed: ${jobName}`))
        .catch((e) => {
          const error = e as Error
          logger.error(error, `Error running cronjob: ${this.jobName}`)
        })
    }
    this.cronJob = new CronJob(cronTime, this.runFunction)
  }
}

const blockScheduledTask = new AbstractCronJob(
  mainBlockFunction,
  '*/1 * * * *',
  'assets scheduled task'
)

export const jobList: AbstractCronJob[] = [blockScheduledTask]
