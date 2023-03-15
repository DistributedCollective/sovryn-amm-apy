import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import config from '../config/config'

export const web3 = new Web3(config.RSKRpc)

export const createContract = (abi: AbiItem[], address: string): Contract => {
  const contract = new web3.eth.Contract(abi, address.toLowerCase())
  return contract
}
