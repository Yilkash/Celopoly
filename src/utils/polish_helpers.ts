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

