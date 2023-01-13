interface PoolBalanceResponse {
  ammPool: string
  contractBalanceToken: number
  stakedBalanceToken: number
  tokenDelta: number
  contractBalanceBtc: number
  stakedBalanceBtc: number
  btcDelta: number
  yesterdayApy: [
    {
      pool: string
      pool_token: string
      activity_date: Date
      apy: number
    }
  ]
}

export const examplePoolBalanceResponse: PoolBalanceResponse = {
  ammPool: 'SOV',
  contractBalanceToken: 399096.80531145,
  stakedBalanceToken: 397805.80866456,
  tokenDelta: 1290.996646889951,
  contractBalanceBtc: 6.67648919,
  stakedBalanceBtc: 6.66451788,
  btcDelta: 0.011971309999999846,
  yesterdayApy: [
    {
      pool: '0xc2d05263318e2304fc7cdad40eea6a091b310080',
      pool_token: '0xdF298421cb18740a7059B0af532167FAa45e7a98',
      activity_date: new Date('2023-01-12T00:00:00.000Z'),
      apy: 0
    }
  ]
}
