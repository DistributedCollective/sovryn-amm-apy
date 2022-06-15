/**
 * This cron job deletes all block-by-block data older than the max retention days (set in the config)
 */

import { dataCleanup } from '../models/apyBlock.model'
import config from '../config/config'

const { maxBlockDataRetention } = config

export async function main (): Promise<void> {
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() - maxBlockDataRetention)
  await dataCleanup(maxDate)
}
