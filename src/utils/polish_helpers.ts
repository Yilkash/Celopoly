// Step 1
/**
 * Truncates an EVM or Stacks address for UI display.
 * @param address The address string
 * @param chars Number of characters to show at start/end
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 3) return address;
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

// Step 2
/**
 * Formats Wei or small token denominations to human-readable Ether/Celo decimal format.
 * @param wei Amount in smallest denomination
 * @param decimals Number of decimal points to show
 */
export function formatWei(wei: bigint | string | number, decimals = 4): string {
  const value = BigInt(wei);
  const divisor = 10n ** 18n;
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;
  let fractionalStr = fractionalPart.toString().padStart(18, '0');
  fractionalStr = fractionalStr.substring(0, decimals);
  return `${integerPart}.${fractionalStr}`;
}

// Step 3
/**
 * Resolves after a specified number of milliseconds.
 * @param ms Delay in milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Step 4
/**
 * Clamps a number between a minimum and maximum value.
 * @param val The input value
 * @param min Minimum boundary
 * @param max Maximum boundary
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// Step 5
/**
 * Generates a random integer within a specified range.
 * @param min Minimum bound
 * @param max Maximum bound
 */
export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Step 6
/**
 * Validates standard EVM address structure using regex.
 * @param address Target hex address
 */
export function isValidCeloAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Step 7
/**
 * Calculates exponential backoff retry delays with jitter.
 * @param attempt Current retry attempt index
 * @param base Base delay in milliseconds
 */
export function calculateBackoff(attempt: number, base = 1000): number {
  const temp = Math.min(30000, base * Math.pow(2, attempt));
  const jitter = temp * 0.5 * (Math.random() * 2 - 1);
  return Math.floor(temp + jitter);
}

// Step 8
/**
 * Formats a Unix timestamp into a standardized ISO date-time string.
 * @param timestamp Epoch timestamp in seconds or milliseconds
 */
export function formatTimestamp(timestamp: number): string {
  const ms = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  return new Date(ms).toISOString();
}

// Step 9
/**
 * Safely parses percentage values from float inputs.
 * @param value String representing percentage float
 */
export function parsePercentage(value: string): number {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) return 0;
  return parsed / 100;
}

// Step 10
/**
 * Validates if the input token amount is a positive, valid float.
 * @param amount String value representing numerical amount
 */
export function validateAmount(amount: string): boolean {
  const value = parseFloat(amount);
  return !isNaN(value) && value > 0;
}

// Step 11
/**
 * Converts a standard string into its hexadecimal representation.
 * @param str The raw input string
 */
export function toHex(str: string): string {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  } 
  return '0x' + hex;
}

// Step 12
/**
 * Converts a hexadecimal string back to ASCII text.
 * @param hex Hex representation starting with 0x
 */
export function fromHex(hex: string): string {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  let str = '';
  for (let i = 0; i < cleanHex.length; i += 2) {
    str += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
  }
  return str;
}

// Step 13
/**
 * Calculates the maximum expected slippage value.
 * @param amount Original transaction volume
 * @param bps Slippage basis points (1 bps = 0.01%)
 */
export function calculateSlippage(amount: number, bps: number): number {
  return (amount * bps) / 10000;
}

// Step 14
/**
 * Dynamically calculates transaction gas safety buffers based on complexity levels.
 * @param estimatedGas Gas estimate from provider node
 * @param scaleMultiplier Scale ratio (e.g. 1.2 for 20% buffer)
 */
export function getGasBuffer(estimatedGas: bigint, scaleMultiplier = 1.2): bigint {
  const multiplierBasis = BigInt(Math.floor(scaleMultiplier * 100));
  return (estimatedGas * multiplierBasis) / 100n;
}

// Step 15
/**
 * Compactly formats large numbers to K, M, B notations.
 * @param num Raw input number
 */
export function formatNumberCompact(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}

// Step 16
/**
 * Confirms if a private key string possesses valid formatting parameters.
 * @param pk Target private key string candidate
 */
export function isValidPrivateKey(pk: string): boolean {
  const cleanPk = pk.startsWith('0x') ? pk.slice(2) : pk;
  return /^[a-fA-F0-9]{64}$/.test(cleanPk);
}

// Step 17
/**
 * Attempts a safe JSON parse, returning fallback if error occurs.
 * @param str Target json formatted string
 * @param fallback Return value when parse fails
 */
export function safeJSONParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch (err) {
    return fallback;
  }
}

// Step 18
/**
 * Delays execution by a random amount within constraints.
 * @param minMs Minimum delay in ms
 * @param maxMs Maximum delay in ms
 */
export async function sleepRandom(minMs: number, maxMs: number): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Step 19
/**
 * Simple checker to check if wallet address matches stacks format.
 * @param address Stacks address candidate
 */
export function validateStacksAddress(address: string): boolean {
  return /^(S[1-9A-HJ-NP-Za-km-z]{39,47})$/.test(address);
}

// Step 20
/**
 * Formats microSTX values into decimal STX format.
 * @param microstx Amount in microSTX
 */
export function formatSTX(microstx: bigint | number | string): string {
  const val = Number(microstx);
  return (val / 1000000).toFixed(6);
}

