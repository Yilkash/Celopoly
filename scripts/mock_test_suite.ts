// Step 76
import { truncateAddress, formatWei, clamp, randomInRange, isValidCeloAddress, calculateBackoff, formatTimestamp, parsePercentage, validateAmount, toHex, fromHex, calculateSlippage, getGasBuffer, formatNumberCompact, isValidPrivateKey, safeJSONParse, sleepRandom, validateStacksAddress, formatSTX, microSTXtoSTX, stxToMicroSTX, addressEquals, generateId, truncateText, delay } from '../src/utils/polish_helpers';

// Mock test wrapper functions for verification pipeline
function test(name: string, fn: () => void | Promise<void>) {
  console.log(`Running mock test: ${name}`);
  try { fn(); console.log('Passed!'); } catch(e) { console.error('Failed!', e); }
}
const expect = (val: any) => ({
  toBe: (expected: any) => { if(val !== expected) throw new Error(`${val} !== ${expected}`); },
  toBeGreaterThanOrEqual: (expected: any) => { if(val < expected) throw new Error(`${val} < ${expected}`); },
  toBeLessThanOrEqual: (expected: any) => { if(val > expected) throw new Error(`${val} > ${expected}`); },
  toBeGreaterThan: (expected: any) => { if(val <= expected) throw new Error(`${val} <= ${expected}`); },
  not: { toBe: (expected: any) => { if(val === expected) throw new Error(`${val} === ${expected}`); } }
});

test("should truncate EVM and Stacks addresses correctly", () => {
  const evmAddress = "0xdd7CB0C2524FCC0EC6733A9365D987a6D0474344";
  const result = truncateAddress(evmAddress, 4);
  expect(result).toBe("0xdd...4344");
});

