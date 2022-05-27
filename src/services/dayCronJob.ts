import { getDailyAggregatedApy } from '../models/apyBlock.model'
import { saveApyDayRow } from '../models/apyDay.model'

export async function main (): Promise<void> {
  const dayData = await getDailyAggregatedApy()
  for (const row of dayData) {
    await saveApyDayRow(row)
    console.log('Row saved', row)
  }
  console.log('All rows saved')
}
