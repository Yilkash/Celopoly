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

