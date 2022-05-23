import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { ApyBlock } from "../entity";
import { ValidateError } from "../errorHandlers/baseError";
import { notEmpty } from "../utils/common";
import { isNil } from "lodash";

export interface ILmApyBlock {
  blockTimestamp: number;
  poolToken: string;
  block: number;
  pool: string;
  balanceBtc: string;
  conversionFeeBtc: string;
  rewards: string;
  rewardsCurrency: string;
  rewardsBtc: string;
}

export async function createMultipleBlockRows(
  blockData: ILmApyBlock[]
): Promise<ApyBlock[]> {
  const apyBlockRepository = getRepository(ApyBlock);
  const newRows = blockData.map((item) => {
    let newRow = new ApyBlock();
    newRow.balanceBtc = Number(item.balanceBtc);
    newRow.blockTimestamp = new Date(item.blockTimestamp * 1000);
    newRow.block = item.block;
    newRow.poolToken = item.poolToken;
    newRow.pool = item.pool;
    newRow.conversionFeeBtc = Number(item.conversionFeeBtc);
    newRow.rewards = Number(item.rewards);
    newRow.rewardsCurrency = item.rewardsCurrency;
    newRow.rewardsBtc = Number(item.rewardsBtc);
    return newRow;
  });
  const promises = newRows.map(async (item) => {
    try {
      await item.validateStrict();
      return item;
    } catch (error) {
      return null;
    }
  });

  const validatedApyBlocks = await Promise.all(promises);
  const filteredApyBlocks = validatedApyBlocks.filter(notEmpty);

  const result: ApyBlock[] = await apyBlockRepository.save(filteredApyBlocks);
  return result;
}
