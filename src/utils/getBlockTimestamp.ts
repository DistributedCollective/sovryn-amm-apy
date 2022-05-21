import Web3 from 'web3'
import config from '../config/config'

export async function getBlockTimestamp (blockNumber: number): Promise<number> {
  const web3 = new Web3(config.RSKRpc)
  const blockData = await web3.eth.getBlock(blockNumber)
  return Number(blockData.timestamp)
}
