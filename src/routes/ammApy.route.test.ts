/* eslint-env jest */
import app from "../app";
import request from "supertest";
import { examplePoolBalanceResponse } from "../types/apiResponseData";
import { ApyDay } from "../entity";
import { mockLiquidityPoolData } from "../utils/mockData/liquidityPoolData";

jest.mock("../services/helpers.ts", () => ({
  getCurrentBlock: jest.fn().mockImplementation(async () => {
    console.log("MOCK1!!!");
    return Promise.resolve(3100000);
  }),
  getLiquidityPoolDataByBlock: jest.fn().mockImplementation(async () => {
    console.log("MOCK2!!!!");
    return Promise.resolve(mockLiquidityPoolData);
  })
}));

jest.mock("../services/balanceCache.ts", () => {
  const originalBalanceCache = jest.requireActual<
    typeof import("../services/balanceCache")
  >("../services/balanceCache.ts");
  console.log(originalBalanceCache);
  return {
    _esModule: true,
    ...originalBalanceCache,
    balances: {
      SOV: {
        ammPool: "",
        contractBalanceToken: 1,
        stakedBalanceToken: 2,
        contractBalanceBtc: 3,
        stakedBalanceBtc: 4,
        tokenDelta: 5,
        btcDelta: 6
      }
    }
  };
});

jest.mock("../models/apyDay.model.ts", () => ({
  getOnePoolApy: jest.fn().mockImplementation(async () => {
    console.log("Calling mockGetOnePoolApy");
    const item1 = new ApyDay();
    item1.pool = "testPool";
    item1.poolToken = "testPoolToken";
    item1.date = new Date();
    item1.rewardsApy = 0.04;
    item1.feeApy = 0.03;
    item1.totalApy = 0.035;
    return Promise.resolve([item1]);
  })
}));

/**
 * Mock: getOnePoolData db function
 * Mock: balance cache
 */

const alphabeticalSort = (a: string, b: string): number =>
  a[0] > b[0] ? 1 : -1;

describe("GET /pool-balance/:pool", () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });
  it("Returns correct data format", async () => {
    //await balanceCache.initialize();
    const result = await request(app).get("/amm/pool-balance/SOV").send();
    console.log(result.body);
    const expectedKeys = Object.keys(examplePoolBalanceResponse);
    expect(result.status).toBe(200);
    expect(Object.keys(result.body).sort(alphabeticalSort)).toEqual(
      expectedKeys.sort(alphabeticalSort)
    );
    const expectedYesterdayApyKeys = Object.keys(
      examplePoolBalanceResponse.yesterdayApy[0]
    );
    expect(
      Object.keys(result.body.yesterdayApy[0]).sort(alphabeticalSort)
    ).toEqual(expectedYesterdayApyKeys.sort(alphabeticalSort));
  }, 10000);
});
