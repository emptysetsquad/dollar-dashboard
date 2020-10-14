import { getPool } from "./infura";
import { ESDS } from "../constants/tokens";
import { DollarPool1, DollarPool2, DollarPool3 } from "../constants/contracts";

export async function getPoolAddress(): Promise<string> {
  const pool = await getPool(ESDS.addr);
  if (pool.toLowerCase() === DollarPool2.toLowerCase()) {
    return DollarPool2;
  }
  if (pool.toLowerCase() === DollarPool3.toLowerCase()) {
    return DollarPool3;
  }

  throw "Unrecognized Pool Address";
}

export function getLegacyPoolAddress(poolAddress): string {
  if (poolAddress === DollarPool2) {
    return DollarPool1;
  }
  if (poolAddress === DollarPool3) {
    return DollarPool2;
  }

  throw "Unrecognized Pool Address";
}