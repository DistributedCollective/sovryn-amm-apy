import { getDailyAggregatedApy } from '../models/apyBlock.model'
import { saveApyDayRow } from '../models/apyDay.model'
import log from '../logger'

const logger = log.logger.child({ module: 'Apy Day Cronjob' })

export async function main (): Promise<void> {
  const dayData = await getDailyAggregatedApy()
  for (const row of dayData) {
    await saveApyDayRow(row)
  }
  logger.info('All amm apy day data rows saved')
}
