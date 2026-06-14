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

